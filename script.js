document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const inputSelectCities = document.getElementById('select-cities'),
        closeButton = document.querySelector('.close-button'),
        button = document.querySelector('.button'),
        label = document.querySelector('.label'),
        dropdownLists = document.querySelector('.dropdown-lists'),
        arr = [];

    inputSelectCities.value = '';

    //получил данные.
    // const dbSites = () => {
    //     fetch('./db_cities.json')
    //         .then((data) => {
    //             if (data.status !== 200) throw new Error('нет связи');
    //             return data.json();
    //         })
    //         .then((data) => {
    //             for (let key in data) {
    //                 console.log(key);
    //                 dataDbSites[key] = data[key];
    //             }
    //         })
    //         .catch((error) => console.error(error));
    // };

    const dataDbSites = (classSelect, col, citi, lang = 'RU') => {
        for (let keyLeng in data) {
            arr.splice(0, arr.length);
            if (keyLeng === lang) {
                if (document.querySelector(classSelect).querySelector('.dropdown-lists__col') !== null) {
                    document.querySelector(classSelect).querySelector('.dropdown-lists__col').remove();
                }

                let block = document.createElement('div');
                block.classList.add('dropdown-lists__col');

                for (let countr in data[keyLeng]) {
                    let citie = data[keyLeng][countr].cities,
                        temp = [];

                    if (citi !== undefined && citi !== data[keyLeng][countr].country) {
                        continue;
                    }

                    const div = document.createElement('div');
                    div.classList.add('dropdown-lists__countryBlock');
                    div.innerHTML = `<div class="dropdown-lists__total-line">
                                    <div class="dropdown-lists__country">${data[keyLeng][countr].country}</div>
                                    <div class="dropdown-lists__count">${data[keyLeng][countr].count}</div>
                                    </div>`;
                    block.append(div);

                    for (let cities in citie) {
                        temp.push({
                            country: data[keyLeng][countr].country,
                            countryCount: data[keyLeng][countr].count,
                            citiseName: citie[cities].name,
                            citiseCount: Number(citie[cities].count.trim()),
                            citiseLink: citie[cities].link
                        });
                        temp.sort((a, b) => {
                            return b.citiseCount - a.citiseCount;
                        });
                    }

                    let divCity0;
                    if (citi !== undefined) {
                        divCity0 = document.createElement('div');
                        divCity0.classList.add('dropdown-lists__line');
                        divCity0.innerHTML = `
                                        <div class="dropdown-lists__city">${temp[0].citiseName}</div>
                                        <div class="dropdown-lists__count">${temp[0].citiseCount}</div>
                                            `;
                    } else {
                        divCity0 = document.createElement('div');
                        divCity0.classList.add('dropdown-lists__line');
                        divCity0.innerHTML = `
                        <div class="dropdown-lists__city dropdown-lists__city--ip">${temp[0].citiseName}</div>
                        <div class="dropdown-lists__count">${temp[0].citiseCount}</div>`;
                    }

                    div.append(divCity0);

                    let x = 0;

                    if (Number(col) !== 3) {
                        x = temp.length;
                    } else {
                        x = col;
                    }

                    for (let i = 1; i < x; i++) {
                        const divCity1 = document.createElement('div');
                        divCity1.classList.add('dropdown-lists__line');
                        divCity1.innerHTML = `
                        <div class="dropdown-lists__city">${temp[i].citiseName}</div>
                        <div class="dropdown-lists__count">${temp[i].citiseCount}</div>`;
                        div.append(divCity1);
                    }

                    temp.forEach((item) => {

                        arr.push(item);
                    });
                }

                document.querySelector(classSelect).append(block);

                return;

            }
        }
    }

    //поиск
    const filterArr = () => {
        const arrFilter = [];
        arrFilter.splice(0, arrFilter.length);

        if (document.querySelector('.dropdown-lists__list--autocomplete').querySelector('.dropdown-lists__col') !== null) {
            document.querySelector('.dropdown-lists__list--autocomplete').querySelector('.dropdown-lists__col').remove();
        }

        let selectfilter = inputSelectCities.value.toLowerCase();

        let block = document.createElement('div'),
            divCountryBlock = document.createElement('div');
        block.classList.add('dropdown-lists__col');
        divCountryBlock.classList.add('dropdown-lists__countryBlock');

        if (selectfilter.length !== 0) {
            arr.forEach((item) => {
                let itemSpisok = item.citiseName.trim().toLowerCase();

                if (selectfilter === itemSpisok.substring(0, selectfilter.length)) {
                    arrFilter.push(item);
                }
            });
        }

        if (arrFilter.length === 0) {
            divCountryBlock.textContent = 'Ничего не найдено';
        }

        arrFilter.forEach((item) => {
            let divLine = document.createElement('div');
            divLine.classList.add('dropdown-lists__line');
            divLine.innerHTML = `<div class="dropdown-lists__city">${item.citiseName}</div>
                                <div class="dropdown-lists__count">${item.citiseCount}</div>`;
            divCountryBlock.append(divLine);
        });

        block.append(divCountryBlock);
        document.querySelector('.dropdown-lists__list--autocomplete').append(block);
    };

    // подстановка значений в инпут и ссылка
    const inputValue = (item) => {
        inputSelectCities.value = item.textContent;

        label.textContent = '';
        closeButton.style.display = 'block';

        if (item.matches('.dropdown-lists__city')) {
            arr.forEach((key) => {
                if (key.citiseName === item.textContent) {
                    button.setAttribute('href', '#');
                    button.href = key.citiseLink;
                    button.setAttribute('target', "_blank");
                }
            });
        }
    };

    // сброс 
    const closeDefault = () => {
        closeButton.style.display = '';
        document.querySelector('.dropdown-lists__list--default').style.display = '';
        document.querySelector('.dropdown-lists__list--autocomplete').style.display = '';
        document.querySelector('.dropdown-lists__list--select').style.display = '';
        inputSelectCities.value = '';
        label.textContent = 'Страна или город';
        button.removeAttribute('href');
        button.removeAttribute('target');
    };

    // добавление по событию  
    inputSelectCities.addEventListener('click', (event) => {
        event.preventDefault();
        dataDbSites('.dropdown-lists__list--default', 3);
        closeDefault();
    });

    dropdownLists.addEventListener('click', (event) => {
        let target = event.target;
        if (target.matches('.dropdown-lists__country') && target.closest('.dropdown-lists__list--default')) {
            document.querySelector('.dropdown-lists__list--default').style.display = 'none';
            dataDbSites('.dropdown-lists__list--select', 0, target.textContent);
            document.querySelector('.dropdown-lists__list--select').style.display = 'inline';
        }

        if (target.closest('.dropdown-lists__total-line') && target.closest('.dropdown-lists__list--select')) {
            dataDbSites('.dropdown-lists__list--default', 3);
            closeDefault();
        }

        if (target.closest('.dropdown-lists__line') && target.closest('.dropdown-lists__list--select')) {
            document.querySelector('.dropdown-lists__list--select').style.display = '';
        }

        if (target.matches('.dropdown-lists__city') || target.matches('.dropdown-lists__country')) {
            inputValue(target);
        }

    });

    inputSelectCities.addEventListener('input', () => {
        document.querySelector('.dropdown-lists__list--default').style.display = 'none';
        document.querySelector('.dropdown-lists__list--select').style.display = '';
        document.querySelector('.dropdown-lists__list--autocomplete').style.display = 'inline';
        closeButton.style.display = 'block';
        filterArr();
    });

    closeButton.addEventListener('click', () => {
        if (document.querySelector('.dropdown-lists__col') !== null) {
            document.querySelectorAll('.dropdown-lists__col').forEach((item) => {
                item.remove();
            });
        }
        closeDefault();
    });

});