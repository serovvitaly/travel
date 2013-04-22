window.twiket = window.twiket || {};
window.l10n = window.l10n || {};
l10n.calendar = {
	months_N: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
	months_D: ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августa", "Сентября", "Октября", "Ноября", "Декабря"],
	months_S: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
	days_N: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
	days_S: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
	days_S1: ["В", "П", "В", "С", "Ч", "П", "С"],
	weekend: [0, 6],
	weekstart: 1
};
l10n.minute_simb = 'м';
l10n.minute_sign = 'мин';
l10n.minute = 'минута';
l10n.minutes1 = 'минуты';
l10n.minutes2 = 'минут';
l10n.minutes3 = 'минуту';
l10n.hour_simb = 'ч';
l10n.hour_sign = 'час';
l10n.hour = 'час';
l10n.hours1 = 'часа';
l10n.hours2 = 'часов';
l10n.day_simb = 'д';
l10n.day_sign = 'дн';
l10n.day = 'день';
l10n.days1 = 'дней';
l10n.days2 = 'дня';
l10n.month_simb = 'мс';
l10n.month_sign = 'мес';
l10n.currency = {
	RUB: {
		Symbol: 'р',
		Abbr: 'руб.',
		Nominative: 'рубль',
		Genitive: 'рубля',
		Genitive_Plural: 'рублей',
		Preposition_plural: "рублях",
		Name: 'рубли'
	},
	EUR: {
		Symbol: '€',
		Abbr: 'евро',
		Nominative: 'евро',
		Genitive: 'евро',
		Genitive_Plural: 'евро',
		Preposition_plural: "евро",
		Name: 'евро'
	},
	USD: {
		Symbol: '$',
		Abbr: 'дол.',
		Nominative: 'доллар',
		Genitive: 'доллара',
		Genitive_Plural: 'долларов',
		Preposition_plural: "долларах",
		Name: 'доллары'
	},
	UAH: {
		Symbol: 'грн',
		Abbr: 'грн.',
		Nominative: 'гривна',
		Genitive: 'гривен',
		Genitive_Plural: 'гривен',
		Preposition_plural: "гривнах",
		Name: 'гривны'
	},
	AZN: {
		Symbol: 'AZN',
		Abbr: 'AZN.',
		Nominative: 'манат',
		Genitive: 'манат',
		Genitive_Plural: 'манат',
		Preposition_plural: 'манат',
		Name: 'манат'
	}
};
l10n.and = 'и';
l10n.date_from = 'c';
l10n.date_to = 'по';
l10n.errorGetData = 'Ошибка получения данных';/* Не используется */
l10n.errorNoFlights = 'На выбранные даты и пункты назначения перелётов нет.';
l10n.errorNoFareRules = 'Ошибка получения правил применения тарифа';
l10n.errorInputData = 'Ошибка ввода данных';
l10n.processSearch = 'Производится поиск';
l10n.processBooking = 'Проверка мест';
l10n.processPayment = 'Производится оформление';
l10n.from = 'Откуда';
l10n.to = 'Куда';
l10n.depart = 'Туда';
l10n.returnDate = 'И обратно';
l10n.oneway = 'В одну ст.';
l10n.setReturnDate = 'Выберите дату обратного вылета';
l10n.passCountForm_show = 'Я укажу количество билетов';
l10n.passCountForm_showBefore = 'до выбора рейсов';
l10n.passCountForm_showAfter = 'после выбора рейсов';
l10n.passCountForm_diff = 'В чём разница?';
l10n.passCountForm_diffPopup = '<div>При выборе авиабилетов на ближайшие даты вылета для нескольких человек, экономия может достигать 20% от стоимости авиабилетов.<br/>Например, если вы летите компанией из двух и более человек, и по более дешевому тарифу (классу бронирования) осталось меньше мест чем необходимо билетов, то при указании количества билетов <b>до выбора</b> рейсов, система предложит вам осуществить покупку по тому тарифу, где на всю группу найдутся места, пусть и дороже. При указании же количества билетов <b>после выбора</b> рейсов, мы разобьем группу на части и оформим билеты в разных тарифах.</div>';
l10n.passCountForm_ADT = 'Билетов для взрослых';
l10n.passCountForm_CNN = 'Детей от 2 до 12 лет';
l10n.passCountForm_INF = 'до 2 лет';
l10n.startSearch = 'Найти варианты перелёта';
l10n.stat_show = 'Посмотреть динамику цен';
l10n.stat_title = 'Динамика цен';
l10n.stat_depart = 'вылет туда';
l10n.stat_return = 'вылет обратно через';
l10n.stat_balloon_found = 'найдено';
l10n.stat_balloon_ago = 'назад';
l10n.stat_balloon_depart = 'туда';
l10n.stat_balloon_return = 'обратно';
l10n.statistics_whithStops = 'все варианты';
l10n.statistics_withoutStops = 'только прямые рейсы';
l10n.statistics_note = 'Динамика цен основана на данных, полученных посредством запросов пользователей.<br/>Просим отнестись с пониманием к тому, что из-за быстро меняющихся тарифов<br/>авиакомпаний места на рейсы по указанным ценам могут быть уже недоступны.';
l10n.statistics_noData = 'нет данных';
l10n.searchHeader = 'Перелёт по маршруту (<span class="tw-link tw-dotted">изменить</span>)';
l10n.step = 'Шаг';
l10n.showOneInCurrency = 'Цены за 1 билет в ';
l10n.showAllInCurrency = 'Цены за <b>все</b> билеты в ';
l10n.prefered_cheap = 'Самый дешёвый вариант';
l10n.prefered_fast = 'Самый быстрый вариант';
l10n.prefered_cheapestOfDirect = 'Самый дешёвый вариант из прямых';
l10n.chooseHintThere = 'Выберите вариант перелёта туда';
l10n.chooseHintBack = 'Выберите вариант перелёта обратно';
l10n.moreFlights = 'ещё варианты';
l10n.resultsTable_takeoff = 'Вылет';
l10n.resultsTable_duration = 'В пути';
l10n.resultsTable_arrival = 'Прилёт';
l10n.resultsTable_airline = 'Авиакомпания';
l10n.resultsTable_route = 'Маршрут';
l10n.resultsTable_price = 'Цена';
l10n.resultsTable_priceRound = 'Цена туда-обратно';
l10n.tooltip0 = 'Пересадка через ночь в г.&thinsp;';
l10n.tooltip1 = 'Пересадка в г.&thinsp;';
l10n.tooltip2 = 'Пересадка в аэропорту ';
l10n.tooltip3 = 'со сменой аэропорта ';
l10n.tooltip4 = 'Остановка в аэропорту ';
l10n.tooltip5 = 'смена борта';
l10n.tooltip6 = 'перелёт авиакомпаниями ';
l10n.tooltip7 = 'перелёт авиакомпанией ';
l10n.there = 'ТУДА';
l10n.back = 'ОБРАТНО';
l10n.seats = 'мест';
l10n.through = 'через';
l10n.changeBoard = 'пересадки';
l10n.noChangeBoard = 'без пересадок';
l10n.direct = 'прямой';
l10n.stop = 'остановка';
l10n.stops = 'остановки';
l10n.prefered_in = 'в';/* ? */
l10n.prefered_out = 'из';/* ? */
l10n.priceFrom = 'от';
l10n.returnResults_of = 'из';
l10n.operated = 'выполняет';
l10n.board = 'Пересадка';
l10n.baggage = 'Норма бесплатного провоза багажа для 1-го пассажира: <span>${$data.bg}</span>';
l10n.visaInfo = 'Визовая справка для граждан страны <span class="tw-select"></span> по выбранному перелёту — <a>ознакомиться</a>';
l10n.more = 'подробнее';
l10n.bg1 = 'багажное место';
l10n.bg8 = 'багажных места';
l10n.kg = 'кг';
l10n.button_buy = 'Купить за';
l10n.popup_cancelPrereservation = 'К сожалению, на этот рейс удалось забронировать места только для следующих пассажиров:';
l10n.popup_noSeats = 'Больше мест на этот рейс нет ни в экономе ни в бизнес классе.';
l10n.popup_chooseAnotherVariant = 'Выбрать другой вариант';
l10n.popup_agree = 'Согласен';
l10n.popup_oldPrice = 'К сожалению, авиакомпания не подтвердила наличие мест по старой цене';
l10n.popup_newPrice = 'Новая цена выбранного тарифа';
l10n.matrix_found1 = 'Найден ';
l10n.matrix_found2 = 'Найдено ';
l10n.matrix_variants1 = ' вариант перелёта';
l10n.matrix_variants2 = ' варианта перелёта';
l10n.matrix_variants3 = ' вариантов перелёта';
l10n.matrix_otherAk = 'остальные АК';
l10n.matrix_moreAk = 'еще АК';
l10n.matrix_all = 'все<br/>варианты';
l10n.matrix_direct = 'прямые';
l10n.matrix_whithBoardChange = 'с пересадкой';
l10n.notConfirmed = 'Невозможно подтвердить тариф';
l10n.notConfirmed_laterAndRemove = '<p>Попробуйте позднее или выберите другой тариф.<br/>Тарифы с неподтверждёнными перелётами удалены из результатов поиска.</p>';
l10n.notConfirmed_later10minutes = '<p>Невозможно подтвердить данный тариф.</p><p>Попробуйте снова через 10 минут.</p>';
l10n.notConfirmed_noflights = '<p>Тарифы с неподтверждёнными перелётами удалены из результатов поиска.</p><p><b>По заданным параметрам поиска больше перелётов нет</b>.<br/>Необходимо осуществить поиск на другие даты или другие пункты перелёта.</p>';
l10n.warning = 'Внимание!';
l10n.close = 'Закрыть';
l10n.continueOrder = 'Продолжить оформление';
l10n.noConnection = 'Нет связи';
l10n.systemError = 'Ошибка системы';
l10n.systemComment = '<p>Произошел сбой системы. Мы уже занимаемся устранением проблемы.<br/>Это займет некоторое время, воспользуйтесь системой чуть позднее.</p>';
l10n.noConnectionComment = '<p>Пожалуйста, проверьте соединение с интернетом и повторите запрос.</p>';
l10n.errorConnection = '<p>Ошибка соединения с сервером.</p>';
l10n.errorData = 'Ошибка данных';
l10n.errorInFields = 'Возможно вы ошиблись в заполнении необходимых полей.';
l10n.errorPasCount = 'Ошибка количества пассажиров';
l10n.errorKids = '<p>Дети не могут лететь без сопровождения взрослых.</p>';
l10n.checkPassengersData = '<p>Проверьте данные пассажиров.</p>';
l10n.errorConfirm = 'Авиакомпания не подтвердила тариф';
l10n.errorConfirmComment = '<p>К сожалению этот тариф нельзя забронировать.<br/>Выберите другой или начните новый поиск.</p>';
l10n.errorTransaction = 'Ошибка транзакции';
l10n.errorPayment = 'Оплата не произведена';
l10n.wrongPosPassword = 'Не верный код покупателя.';
l10n.impossiblePaymentVariant = 'В данный момент выбранный вариант оплаты не доступен.<br/>Пожалуйста, попробуйте позднее.';
l10n.impossiblePaymentVariant1 = 'В данный момент выбранный вариант оплаты не доступен.<br/>Пожалуйста, попробуйте позднее или выбирите другой вариант оплаты.';
l10n.errorNoMoneyRecharge = '<p>Ваш банк ответил, что на Вашей карте недостаточно денежных стредств.<br/>Пожалуйста пополните карту или воспользуйтесь другой картой.</p>';
l10n.anotherCard = '<p>По Вашей карте невозможно совершить покупку.<br/>Попробуйте ввести данные другой карты.</p>';
l10n.priceChanged = 'Цена изменилась';
l10n.newSearch = 'Новый поиск';
l10n.newSearchComment = 'Необходимо снова осуществить поиск.';
l10n.errorBonusCard = 'Ошибка бонусной карты';
l10n.errorBonusCardComment = '<p>Проверьте правильность ввода данных Вашей бонусной карты.</p>';
l10n.errorPrereservation = 'Предварительная бронь аннулирована';
l10n.errorPrereservationComment = '<p>Билеты не были оплачены в отведённое системой время.<br/>В случае необходимости, Вы можете произвести новый поиск и оформить покупку.</p>';
l10n.errorCvv = '<p>Не верный cvv/cvc код</p>';
l10n.reprice = 'К сожалению, тариф по выбранному классу необходимо обновить.<br/>Возможно изменение цены. Выберите другой тариф или запустите поиск снова';
l10n.errorAk = 'Отказ авиакомпании';
l10n.errorSegmentsComment = '<p>К сожалению, авиакомпания не подтвердила наличие мест на один из выбранных Вами сегментов.<br/>Пожалуйста, выберите другой вариант перелёта.</p>';
l10n.impossiblePlaceOrder = 'Невозможно оформить заказ';
l10n.notEnoughtTimeToDeparture = '<p>До времени вылета первого сегмента осталось менее 2-х часов.<br/>Пожалуйста, выберите другой вариант перелёта.</p>';
l10n.checkPassengers = '<p>Проверьте данные пассажиров.</p>';
l10n.checkData = '<p>Проверьте данные внимательно.</p>';
l10n.checkPassengerN1 = 'Проверьте данные пассажира №';
l10n.checkPassengerN2 = 'Проверьте внимательно данные пассажира №';
l10n.checkPayment = 'Проверить данные и попробовать оплатить снова';
l10n.cardProblem = 'Вероятные причины:<ul><li>Вы ошиблись при вводе номера карты, срока действия, CVV/CVC кода;</li><li>Ваш банк установил ограничения на сумму или обьём оплат;</li><li>Ваш банк запретил проведение оплаты через интернет.</li><li>Недостаточно средств на карточном счёте.</li></ul>Пожалуйста, позвоните в Ваш банк по&nbsp;телефону технической поддержки (обычно работает 24 часа в сутки), указанному на обратной стороне Вашей банковской карты, и опишите проблему. Ваш банк наверняка пойдет Вам навстречу.';
l10n.cardProblem2 = '<br/>Другие возможные причины отказа:<ul class="disc"><li>Ваш банк запретил проведение оплаты через интернет;</li><li>Ваш банк установил ограничения на сумму или обьём оплат.</li></ul><p>Пожалуйста, позвоните в Ваш банк по&nbsp;телефону технической поддержки (обычно работает 24 часа в сутки), указанному на обратной стороне Вашей банковской карты, и опишите проблему. Ваш банк наверняка пойдет Вам навстречу.</p>';
l10n.cardProblemOptions = ['<div>Проверьте корректность ввода номера карты, срока действия, CVV/CVC кода.<br/>Удостоверьтесь в наличии денежных средств на карте.</div>', '<div>Попробуйте выбрать другой метод оплаты.</div>'];
l10n.cardAuth_cardCheck = 'Проверка карты';
l10n.cardAuth_html_cardCheckComment = 'Необходимо убедиться, что Вы действительно являетесь владельцем указанной карты.<br/>Для этого мы заблокировали незначительную сумму.<br/>В назначении платежа указан 4-значный код в виде: CODE(XXXX).';
l10n.cardAuth_cvv = 'Проверочный код';
l10n.cardAuth_confirm = 'Подтвердить';
l10n.cardAuth_errorCode = 'Код был введён не верно, уточните и введите код ещё раз.';
l10n.cardAuth_noteCode = 'Введите 4 цифры кода. Код можно узнать:';
l10n.cardAuth_titleSms = 'В SMS от банка';
l10n.cardAuth_noteSms = 'В тексте SMS-уведомления';
l10n.cardAuth_titleBank = 'В интернет-банке';
l10n.cardAuth_noteBank = 'В примечании к платежу';
l10n.cardAuth_titleCard = 'В техподдержке банка';
l10n.cardAuth_noteCard = 'Телефон указан на обороте карты';
l10n.cardAuth_warnCode = 'Если не подтвердить код, через час бронь аннулируется и заблокированная сумма вернётся на счёт.';
l10n.cardAuth_close = 'Закрыть и воспользоваться другой картой';
l10n.passengersForm_title = 'Пассажиры';
l10n.passengersForm_labels_gender = 'Пол';
l10n.passengersForm_labels_lastName = 'Фамилия';
l10n.passengersForm_labels_firstName = 'Имя';
l10n.passengersForm_labels_birthDate = 'Дата рождения';
l10n.passengersForm_labels_passCountry = 'Гражданство';
l10n.passengersForm_labels_passNumber = 'Серия и № документа';
l10n.passengersForm_placeholders_latin = 'Латинскими буквами';
l10n.passengersForm_placeholders_latinAndNumber = 'Лат. буквы и цифры';
l10n.passengersForm_placeholders_date = 'дд.мм.гггг';
l10n.passengersForm_add_adt = 'Взрослый';
l10n.passengersForm_add_child = 'ребёнок';
l10n.passengersForm_add_cnn = 'До 12 лет';
l10n.passengersForm_add_inf = 'До 2 лет без места';
l10n.passengersForm_submit = 'Перейти к оплате';
l10n.passengersForm_errorRequire = 'Все поля должны быть заполнены';
l10n.passengersForm_errorWrongAgeType = 'Возраст пассажира должен соответствовать категории на всех перелётах';
l10n.buyer = 'Покупатель';
l10n.buyerComment = "Введите адрес электронной почты и номер мобильного телефона для связи и отправки маршрутной квитанции.";
l10n.phone = 'Мобильный телефон';
l10n.email = 'Электронная почта';
l10n.payment_title = 'Оплата';
l10n.payment_tableHead_base = 'Тариф';
l10n.payment_tableHead_taxe = 'Таксы';
l10n.payment_tableHead_markup = 'Cбор';
l10n.payment_tableHead_discount = 'Скидка';
l10n.payment_tableHead_amount = 'Итого';
l10n.payment_tableHead_rules = 'Условия возврата и обмена';
l10n.payment_pay = 'Оплатить';
l10n.payment_book = 'Бронировать';
l10n.paymentVariants = {
	card: 'Банковской картой Visa или MasterCard',
	cash: 'Оплата наличными',
	rapida: 'по России в салонах Связной <a href="http://www.svyaznoy.ru/address_shops/" target="_blank">адреса салонов</a>',
	gds: 'напрямую в авиакомпанию',
	payture: 'в авиакомпанию через OneTwoTrip',
	payture_r: 'в авиакомпанию через OneTwoTrip',
	payture_p: 'в авиакомпанию через OneTwoTrip',
	ua_cards: 'в авиакомпанию через OneTwoTrip',
	newstravel: 'г. Киев, ул. Щекавицкая, 30/39, оф.6'
};
l10n.payment_transactions_toAk = 'будут списаны с Вашей карты авиакомпанией {airline}';
l10n.payment_transactions_toOtt = 'будут списаны компанией OneTwoTrip';
l10n.payment_transactions_toAkByOtt = 'будут списаны с Вашей карты компанией OneTwoTrip';
l10n.payment_transactions_willBe = 'что составит';
l10n.payment_transactionsNote = 'Общая стоимость вашего заказа может быть списана с Вашей карты несколькими транзакциями.';
l10n.payment_currencyConvertation = 'Конвертация {rate} произведена по курсу';
l10n.payment_html_currencies = 'Если валюта карты отличается от валюты оплаты,<br/>то конвертация будет произведена <b>по курсу Вашего банка</b>.';
l10n.payment_ADT = 'взрослый';
l10n.payment_CNN = 'ребёнок';
l10n.payment_INF = 'младенец';
l10n.payment_linkRules = 'ознакомиться';
l10n.agreements_title = 'Условия, правила и ограничения';
l10n.agreements_label = 'Принимаю условия, правила и ограничения';
l10n.agreements_HTML = '<ul><li>Билеты не передаваемые, изменение имени и фамилии пассажира после выписки запрещено.</li><li>Стоимость включает тариф, сборы и таксы, включая стоимость перевозки багажа.</li><li>Стоимость не включает возможные сборы, взымаемые авиакомпанией (доп. багаж и другое).</li><li class="tw-discount_markup tw-invisible">Скидки и сборы при возврате билета не возвращаются.</li><li class="tw-markup tw-invisible">Сборы при возврате билета не возвращаются.</li><li class="tw-discount tw-invisible">Скидки при возврате билета не возвращаются.</li></ul>';
l10n.agreementsBlank_HTML = '<p class="agreementsBlank"><a href="${twiket.setup.urls.customeragreement + "?id=" + id}" target="_blank">Лист подтверждения</a></li></p>';
l10n.SSLinfo = 'Передача информации защищена сертификатом SSL от компании DigiCert.<br/>Сайт в полной мере отвечает стандартам безопасности платёжных систем<br/>Visa и MasterCard (PCI compliance).';
l10n.cardHolder = ' (держатель карты)';
l10n.posPassword = 'Код продавца';
l10n.makeorder_errorRequire = 'Все поля должны быть заполнены';
l10n.makeorder_errorWrongCardNumber = 'Номер карты введён не верно';
l10n.makeorder_errorExpiredCard = 'Неправильно введена дата срока действия карты';
l10n.makeorder_errorAgreements = 'Необходимо принять условия, правила и ограничения';
l10n.cancelReservation_comment = 'При незавершении оформления заказа, забронированные места для перечисленных ниже пассажиров будут аннулированы:';
l10n.cancelReservation_unloadMessage = 'Эта страница просит вас подтвердить, что вы хотите уйти — при этом введённые вами данные могут не сохраниться.';
l10n.completed_purchased = 'Заказ <b>{number}</b> {status}.<br/>Информация по заказу выслана Вам на почту <b>{email}</b><br/>Не забудьте распечатать маршрутную квитанцию, перейдя по адресу <a target="_blank" class="tw-show_order" href="https://www.twiket.com/?c={encodedString}">www.twiket.com</a><br/>Желаем приятного полёта!';
l10n.completed_booked = 'Заказы: <b>{number}</b> {status}.<br/>Информация по заказам выслана Вам на почту <b>{email}</b><br/>Оплатить заказы необходимо в течении <b>{time}.</b>';
l10n.completed_booked1 = 'Заказ <b>{number}</b> {status}.<br/>Информация по заказу выслана Вам на почту <b>{email}</b><br/>Оплатить заказ необходимо в течении <b>{time}.</b>';
l10n.completed_status_CAPTURED = ['оформлен', 'оформлены'];
l10n.completed_status_CANCELED = ['отменён', 'отменены'];
l10n.completed_status_ERROR = ['в обработке', 'в обработке'];
l10n.completed_status_WaitingForPayment = ['ожидает оплаты', 'ожидают оплаты'];
l10n.fareRules_link = 'Условия возврата и обмена';
l10n.fareRules_caution = '<div class="tw-title">Внимание!</div>При обмене/возврате к возможным штрафным санкциям авиакомпании по правилам тарифа, дополнительно взымается сервисный сбор:<ul><li>при возврате &mdash; 450 рублей за пассажира;</li><li>при обмене &mdash; 750 рублей за пассажира.</li></ul>При не использовании одного из сегментов маршрута, последующие сегменты могут быть автоматически аннулированы авиакомпанией.';
l10n.fareRules_tariff1 = 'Правила применения тарифа';
l10n.fareRules_tariff2 = 'Правила применения тарифов';
l10n.fareRules_details = 'Пожалуйста, ознакомьтесь детальнее с условиями <span class="tw-link tw-dotted toPenalties">обмена</span>/возврата.';
l10n.fareRules_strict = '<span class="tw-warn">Если по перелёту используется несколько разных правил/тарифов, то при обмене/возврате применяются более строгие правила.</span>';