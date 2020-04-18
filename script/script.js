'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
    //экранная клавиатура
    {
        const keyBoardButton = document.querySelector('.search-form__keyboard');
        const keyBoard = document.querySelector('.keyboard');
        const closeKeyBoard = document.getElementById('close-keyboard');
        const searchInput = document.querySelector('.search-form__input');

        const toggleKeyBoard = () => {
            keyBoard.style.top = keyBoard.style.top ? '' : '50%';
        };

        const changeLang = (btn, lang) => {
            const langRu = [
                'ё', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
                'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
                'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
                'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
                'en', ' '
            ];
            const langEn = [
                '`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
                'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
                'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"',
                'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
                'ru', ' '
            ];

            if (lang === 'en') {
                btn.forEach((elem, i) =>{
                   elem.textContent = langEn[i];
                });
            } else{
                btn.forEach((elem, i) =>{
                    elem.textContent = langRu[i];
                });
            }
        };

        const typing = (event) => {
            const target = event.target;

            if(target.tagName.toLowerCase() === 'button'){
                // buttons = получаем новый массив и filter на пустую кнопку
                const buttons = [...keyBoard.querySelectorAll('button')]
                    .filter((elem => elem.style.visibility !== 'hidden'));
                const contentButton = target.textContent.trim();

                if(contentButton === '⬅'){
                    searchInput.value = searchInput.value.slice(0, -1)
                }
                //пробел если не пробел то бпробел будет
                else if (!contentButton){
                    searchInput.value += ' ';
                }
                else if (contentButton === 'en' || contentButton === 'ru'){
                    changeLang(buttons, contentButton)
                }else {
                    searchInput.value += contentButton;
                }
            }

            //backspace
            //пробел
        };

        keyBoardButton.addEventListener('click', toggleKeyBoard);
        closeKeyBoard.addEventListener('click', toggleKeyBoard);
        keyBoard.addEventListener('click', typing);
    }

    //меню
    {
        const burger = document.querySelector('.spinner');
        const sidebarMenu = document.querySelector('.sidebarMenu');

        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            sidebarMenu.classList.toggle('rollUp');
        });

        sidebarMenu.addEventListener('click', e => {
            let target = e.target;
            target = target.closest('a[href="#"]');

            if(target){
                const parentTarget = target.parentNode;
                sidebarMenu.querySelectorAll('li').forEach(elem => {
                    if(elem === parentTarget){
                        elem.classList.add('active');
                    } else{
                        elem.classList.remove('active');
                    }
                });
            }
        })
    }

    //произходить процедура в контенте
    const youTuber = () => {
        const YouTuberItems = document.querySelectorAll('[data-youtuber]');
        const youTuberModal = document.querySelector('.youTuberModal');
        const youTuberContainer = document.getElementById('youTuberContainer');

        //размеры видео
        const qw = [3840, 2560, 1920, 1280, 854, 640, 426, 256];
        const qh = [2160, 1440, 1080, 720, 480, 360, 240, 144];

        const sizeVideo = () => {
            const ww = document.documentElement.clientWidth;
            const wh = document.documentElement.clientHeight;

            for (let i = 0; i < qw.length; i++){
                if (ww > qw[i]){
                    youTuberContainer.querySelector('iframe').style.cssText = `
                        width: ${qw[i]}px;
                        height: ${qh[i]}px;
                    `;
                    youTuberContainer.style.cssText = `
                        width: ${qw[i]}px;
                        height: ${qh[i]}px;
                        top: ${(wh - qh[i]) / 2}px;
                        left: ${(ww - qw[i]) / 2}px;
                    `;
                    break;
                }
            }
        };

        YouTuberItems.forEach(elem => {
            elem.addEventListener('click', () => {
               const idVideo = elem.dataset.youtuber;
                youTuberModal.style.display = 'block';

                const youTuberFrame = document.createElement('iframe');
                youTuberFrame.src = `https://youtube.com/embed/${idVideo}`;
                youTuberContainer.insertAdjacentElement('beforeend', youTuberFrame);

                window.addEventListener('resize', sizeVideo);
                sizeVideo();
            });
        });

        //закрываем модалку и clearing youTuberContainer
        youTuberModal.addEventListener('click', () => {
            youTuberModal.style.display = '';
            youTuberContainer.textContent = '';
            window.removeEventListener('resize', sizeVideo);
        });

    };
    //Модальное окно
    {
        document.body.insertAdjacentHTML('beforeend', `
              <div class="youTuberModal">
                <div id="youTuberClose">&#215;</div>
                <div id="youTuberContainer"></div>
              </div>
        `);

        youTuber();
    }

    //YouTube api
    {
        const API_KEY = 'YOUR_API';
        const CLIENT_ID = 'YOUR_ID';

        // авторизация
        {
            const buttonAuth = document.getElementById('authorize');
            const authBlock = document.querySelector('.auth');

            gapi.load("client:auth2", () => {
                gapi.auth2.init({client_id: CLIENT_ID});
            });

            const authenticate = () => {
                return gapi.auth2.getAuthInstance()
                    .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
                    .then(() => console.log("Sign-in successful"))
                    .catch(err => console.error("Error signing in", err));
            };
            const loadClient = () => {
                gapi.client.setApiKey(API_KEY);
                return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
                    .then(() => console.log("GAPI client loaded for API"))
                    .then(() => authBlock.style.display = 'none')
                    .catch(err => console.error("Error loading GAPI client for API", err));
            };

            buttonAuth.addEventListener('click', () => {
                authenticate().then(loadClient)
            })

        }

        //request
        {
            const batTube = document.querySelector('.logo-bat');
            const trends = document.getElementById('yt_trend');
            const like = document.getElementById('like');
            const subscriptions = document.getElementById('subscriptions');

            const request = options => gapi.client.youtube[options.method]
                .list(options)
                .then(response => response.result.items)
                .then(render)
                .then(youTuber)
                .catch(err => console.error('ошибка:' + err));

            const render = data => {
                console.log(data);
                const ytWrapper = document.getElementById('yt-wrapper');
                ytWrapper.textContent = '';
                data.forEach(item => {
                   try {
                       const {
                       id,
                           id:{videoId},
                           snippet:{channelTitle, title,
                               resourceId: {videoId: likedVideoId} = {},
                               thumbnails:{
                               high:{url}
                               }
                           }
                       } = item;
                       ytWrapper.innerHTML += `
                            <div class="yt" data-youtuber="${likedVideoId || videoId || id}">
                              <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                                <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
                              </div>
                              <div class="yt-title">${title}</div>
                              <div class="yt-channel">${channelTitle}</div>
                            </div>
                       `;
                   } catch (error) {
                       console.error(error);
                   }
                });
            };

            batTube.addEventListener('click', () => {
                request({
                    method: 'search',
                    part: 'snippet',
                    channelId: 'UCwEON-kPG_56QoDYA5qrpDQ',
                    order: 'date',
                    maxResults: 6,
                })
            });

            trends.addEventListener('click', () => {
                request({
                    method: 'videos',
                    part: 'snippet',
                    chart: 'mostPopular',
                    maxResults: 6,
                    regionCode: 'RU',
                })
            });

            like.addEventListener('click', () => {
                request({
                    method: 'playlistItems',
                    part: 'snippet',
                    playlistId: 'LLQmjILeRERPEibf-vPpypjg',
                    maxResults: 6,
                })
            });

            subscriptions.addEventListener('click', () => {
                request({
                    method: 'subscriptions',
                    part: 'snippet',
                    mine: true,
                    maxResults: 6,
                })
            });

        }
    }
});