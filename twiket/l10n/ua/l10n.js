window.twiket = window.twiket || {};
window.l10n = window.l10n || {};
l10n.calendar = {
	months_N: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
	months_D: ["Січня", "Лютого", "Березня", "Квітня", "Травня", "Червня", "Липня", "Серпня", "Вересня", "Жовтня", "Листопада", "Грудня"],
	months_S: ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"],
	days_N: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
	days_S: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
	days_S1: ["Н", "П", "В", "С", "Ч", "П", "С"],
	weekend: [0, 6],
	weekstart: 1
};
l10n.minute_simb = 'х';
l10n.minute_sign = 'хв';
l10n.minute = 'хвилина';
l10n.minutes1 = 'хвилини';
l10n.minutes2 = 'хвилин';
l10n.minutes3 = 'хвилину';
l10n.hour_simb = 'г';
l10n.hour_sign = 'год';
l10n.hour = 'година';
l10n.hours1 = 'години';
l10n.hours2 = 'годин';
l10n.day_simb = 'д';
l10n.day_sign = 'дн';
l10n.day = 'день';
l10n.days1 = 'днів';
l10n.days2 = 'дні';
l10n.month_simb = 'мс';
l10n.month_sign = 'міс';
l10n.currency = {
	RUB: {
		Symbol: 'р',
		Abbr: 'руб.',
		Nominative: 'рубль',
		Genitive: 'рубля',
		Genitive_Plural: 'рублів',
		Preposition_plural: "рублях",
		Name: 'рублі'
	},
	EUR: {
		Symbol: '€',
		Abbr: 'євро',
		Nominative: 'євро',
		Genitive: 'євро',
		Genitive_Plural: 'євро',
		Preposition_plural: "євро",
		Name: 'євро'
	},
	USD: {
		Symbol: '$',
		Abbr: 'дол.',
		Nominative: 'долар',
		Genitive: 'долара',
		Genitive_Plural: 'доларів',
		Preposition_plural: "доларах",
		Name: 'долари'
	},
	UAH: {
		Symbol: 'грн',
		Abbr: 'грн.',
		Nominative: 'гривня',
		Genitive: 'гривні',
		Genitive_Plural: 'гривень',
		Preposition_plural: "гривнях",
		Name: 'гривні'
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
l10n.and = 'і';
l10n.date_from = 'з';
l10n.date_to = 'по';
l10n.errorGetData = 'Помилка отримання даних';/* Не используется */
l10n.errorNoFlights = 'На обрані дати та пункти призначення перельотів немає.';
l10n.errorNoFareRules = 'Помилка отримання правил застосування тарифу';
l10n.errorInputData = 'Помилка введення даних';
l10n.processSearch = 'Здійснюється пошук';
l10n.processBooking = 'Здійснюється бронювання';
l10n.processPayment = 'Здійснюється оформлення';
l10n.from = 'Звідки';
l10n.to = 'Куди';
l10n.depart = 'Туди';
l10n.returnDate = 'Повернення';
l10n.oneway = 'В одну ст.';
l10n.setReturnDate = 'Оберіть дату зворотнього вильоту';
l10n.passCountForm_show = 'Я вкажу кількість квитків';
l10n.passCountForm_showBefore = 'до обрання рейсу';
l10n.passCountForm_showAfter = 'після обрання рейсу';
l10n.passCountForm_diff = 'У чому різниця?';
l10n.passCountForm_diffPopup = "<div>При виборі авіаквитків на найближчі дати вильоту для кількох людей, економія може досягати 20% від вартості авіаквитків.<br/>Наприклад, якщо ви летите компанією з двох і більше осіб, і за дешевшим тарифом (класу бронювання) залишилося менше місць ніж необхідно квитків, то при вказівці кількості квитків <b> до вибору</b> рейсів, система запропонує вам здійснити покупку по тому тарифу, де на всю групу найдуться місця, нехай і дорожче. При вказівці ж кількості квитків <b>після вибору </ b> рейсів, ми розіб'ємо групу на частини і оформимо квитки в різних тарифах.</div>";
l10n.passCountForm_ADT = 'Квитків для дорослих';
l10n.passCountForm_CNN = 'Дітей від 2 до 12 років';
l10n.passCountForm_INF = 'до 2 років';
l10n.startSearch = 'Знайти варіанти перельоту';
l10n.stat_show = 'Подивитись динаміку цін';
l10n.stat_title = 'Динаміка цін';
l10n.stat_depart = 'виліт туди';
l10n.stat_return = 'виліт назад через';
l10n.stat_balloon_found = 'найдено';
l10n.stat_balloon_ago = 'назад';
l10n.stat_balloon_depart = 'туди';
l10n.stat_balloon_return = 'назад';
l10n.statistics_whithStops = 'всі варіанти';
l10n.statistics_withoutStops = 'тільки прямі рейси';
l10n.statistics_note = 'Динаміка цін основана на даних, отриманих за допомогою запитів користувачів.<br/>Просимо віднестися з розумінням к тому, що із-за тарифів, що швидко змінюються<br/>місця на рейси за вказаними цінами можуть бути вже недоступні.';
l10n.statistics_noData = 'немає даних';
l10n.searchHeader = 'Переліт за маршрутом (<span class="tw-link tw-dotted">змінити</span>)';
l10n.step = 'Крок';
l10n.showOneInCurrency = 'Ціни за 1 квиток в ';
l10n.showAllInCurrency = 'Ціни за <b>всі</b> квитки в ';
l10n.prefered_cheap = 'Найдешевший варіант';
l10n.prefered_fast = 'Найшвидший варіант';
l10n.prefered_cheapestOfDirect = 'Найдешевший варіант серед прямих';
l10n.chooseHintThere = 'Виберіть варіант перельоту туди';
l10n.chooseHintBack = 'Виберіть варіант перельоту назад';
l10n.moreFlights = 'ещё варианты';
l10n.resultsTable_takeoff = 'Виліт';
l10n.resultsTable_duration = 'У дорозі';
l10n.resultsTable_arrival = 'Приліт';
l10n.resultsTable_airline = 'Авіакомпанія';
l10n.resultsTable_route = 'Маршрут';
l10n.resultsTable_price = 'Ціна';
l10n.resultsTable_priceRound = 'Ціна туди-назад';
l10n.tooltip0 = 'Пересадка через ніч у м.&thinsp;';
l10n.tooltip1 = 'Пересадка у м.&thinsp;';
l10n.tooltip2 = 'Пересадка в аеропорту ';
l10n.tooltip3 = 'зі зміною аеропорту ';
l10n.tooltip4 = 'Зупинка в аеропорту ';
l10n.tooltip5 = 'зміна борта';
l10n.tooltip6 = 'переліт авіакомпаніями ';
l10n.tooltip7 = 'переліт авіакомпанією ';
l10n.there = 'ТУДИ';
l10n.back = 'Повернення';
l10n.seats = 'місць';
l10n.through = 'через';
l10n.changeBoard = 'пересадки';
l10n.noChangeBoard = 'без пересадок';
l10n.direct = 'прямий';
l10n.stop = 'зупинка';
l10n.stops = 'зупинки';
l10n.prefered_in = 'в';/* ? */
l10n.prefered_out = 'із';/* ? */
l10n.priceFrom = 'від';
l10n.returnResults_of = 'із';
l10n.operated = 'виконує';
l10n.board = 'Пересадка';
l10n.baggage = 'Норма безкоштовного провозу багажу для 1-го пасажира: <span>${$data.bg}</span>';
l10n.visaInfo = 'Візова довідка для громадян країни <span class="tw-select"></span> по обраному перельоту — <a>ознайомитися</a>';
l10n.more = 'докладніше';
l10n.bg1 = 'багажне місце';
l10n.bg8 = 'багажних місця';
l10n.kg = 'кг';
l10n.button_buy = 'Купити за';
l10n.popup_cancelPrereservation = 'На жаль, на даний рейс вдалось забронювати місця лише для наступних пасажирів:';
l10n.popup_noSeats = 'Більше місць на даний рейс немає ні в економ ні в бізнес класі.';
l10n.popup_chooseAnotherVariant = 'Обрати другий варіант';
l10n.popup_agree = 'Погоджуюсь';
l10n.popup_oldPrice = 'На жаль, авіакомпанія не підтвердила наявність місць за старою ціною';
l10n.popup_newPrice = 'Нова ціна обраного тарифу';
l10n.matrix_found1 = 'Знайдений ';
l10n.matrix_found2 = 'Знайдено ';
l10n.matrix_variants1 = ' варіант перельоту';
l10n.matrix_variants2 = ' варіанта перельоту';
l10n.matrix_variants3 = ' варіантів перельоту';
l10n.matrix_otherAk = 'інші АК';
l10n.matrix_moreAk = 'ще АК';
l10n.matrix_all = 'всі<br/>варіанти';
l10n.matrix_direct = 'прямі';
l10n.matrix_whithBoardChange = 'з пересадкою';
l10n.notConfirmed = 'Неможливо підтвердити тариф';
l10n.notConfirmed_laterAndRemove = '<p>Спробуйте пізніше або оберіть інший тариф.<br/>Тарифи з непідтвердженими перельотами вилучені з результатів пошуку.</p>';
l10n.notConfirmed_later10minutes = '<p>Неможливо підтвердити даний тариф.</p><p>Спробуйте знову через 10 хвилин.</p>';
l10n.notConfirmed_noflights = '<p>Тарифи з непідтвердженими перельотами вилучені з результатів пошуку</p><p><b>По заданим параметрам пошуку більше перельотів немає</b>.<br/>Необхідно здійснити пошук на інші дати або інші пункти перельоту.</p>';
l10n.warning = 'Увага!';
l10n.close = 'Закрити';
l10n.continueOrder = 'Продовжити оформлення';
l10n.noConnection = "Немає зв'язку";
l10n.systemError = 'Помилка системи';
l10n.systemComment = '<p>Відбувся збій системи. Ми вже займаємося усуненням проблеми.<br/>Це займе деякий час, скористайтесь системую трохи пізніше.</p>';
l10n.noConnectionComment = "<p>Будь ласка, перевірте з'єднання з Інтернет і повторіть запит.</p>";
l10n.errorConnection = '<p>Помилка з`єднання з сервером.</p>';
l10n.errorData = 'Помилка даних';
l10n.errorInFields = 'Можливо Ви помилились у заповненні необхідних полів.';
l10n.errorPasCount = 'Помилка кількості пасажирів';
l10n.errorKids = '<p>Діти не можуть летіти без супроводу дорослих.</p>';
l10n.checkPassengersData = '<p>Перевірте дані пасажирів.</p>';
l10n.errorConfirm = 'Авіакомпанія не підтвердила тариф';
l10n.errorConfirmComment = '<p>На жаль цей тариф неможливо забронювати.<br/>Оберіть інший або почніть новий пошук.</p>';
l10n.errorTransaction = 'Помилка транзакції';
l10n.errorPayment = 'Платіж не пройшов';
l10n.wrongPosPassword = 'Не вірний код покупця.';
l10n.impossiblePaymentVariant = 'У даний час обраний варіант оплати не доступний.<br/>Будь ласка, спробуйте пізніше.';
l10n.impossiblePaymentVariant1 = 'У даний час обраний варіант оплати не доступний.<br/>Будь ласка, спробуйте позніше або оберіть інший варіант оплати.';
l10n.errorNoMoneyRecharge = '<p>Недостатньо грошей на карті.<br/>Будь-ласка, поповніть карту або скористайтеся іншою картою.</p>';
l10n.anotherCard = '<p>По Вашій карті неможливо здійснити покупку.<br/>Спробуйте ввести дані іншої карти.</p>';
l10n.priceChanged = 'Ціна змінилась';
l10n.newSearch = 'Новий пошук';
l10n.newSearchComment = 'Необхідно знову здійснити пошук.';
l10n.errorBonusCard = 'Помилка бонусної карти';
l10n.errorBonusCardComment = '<p>Перевірте правильність введення даних Вашої бонусноі карти.</p>';
l10n.errorPrereservation = 'Попереднє бронювання анульоване';
l10n.errorPrereservationComment = '<p>Квитки не були оплачені у відведений системою час.<br/>У разі необхідності, Ви можете виконати новий пошук і оформити покупку.</p>';
l10n.errorCvv = '<p>Не вірний cvv/cvc код</p>';
l10n.reprice = 'На жаль, тариф по обранному класу необхідно поновити.<br/>Можлива зміна ціни. Оберіть інший тариф або запустіть пошук знову';
l10n.errorAk = 'Відмова авіакомпанії';
l10n.errorSegmentsComment = '<p>На жаль, аваакомпанія не підтвердила наявність місць на один з обраних Вами сегментів.<br/>Будь ласка, оберіть інший варіант перельоту.</p>';
l10n.impossiblePlaceOrder = 'Неможливо оформити замовлення';
l10n.notEnoughtTimeToDeparture = '<p>До часу вильоту першого сегменту лишилось менше 2-х годин.<br/>Будь ласка, оберіть інший варіант перельоту.</p>';
l10n.checkPassengers = '<p>Перевірте дані пасажирів.</p>';
l10n.checkData = '<p>Перевірте дані уважно.</p>';
l10n.checkPassengerN1 = 'Перевірте дані пасажира №';
l10n.checkPassengerN2 = 'Перевірте уважно дані пасажира  №';
l10n.checkPayment = 'Перевірити дані і спробувати оплатити знову';
l10n.cardProblem = 'Можливі причини:<ul class="disc"><li>Ви помилилися при введенні номера картки, терміну дії, CVV / CVC коду;</li><li>Ваш банк установив обмеження на суму або об`єм оплат;</li><li>Ваш банк заборонив проведення оплати через інтернет;</li><li>Недостатньо коштів на картковому рахунку.</li></ul><p>Будь ласка, зателефонуйте до Вашого банку по телефону технічної підтримки (зазвичай працює 24 години на добу), вказаному на зворотній стороні Вашої банківської карти, і опишіть проблему. Ваш банк, напевно, піде Вам назустріч.</p>';
l10n.cardProblem2 = '<br/>Інші можливі причини відмови:<ul class="disc"><li>Ваш банк заборонив проведення оплати через інтернет;</li><li>Ваш банк встановив обмеження на суму або обсяг оплат.</li></ul><p>Будь ласка, зателефонуйте в Ваш банк по&nbsp;телефону технічної підтримки (зазвичай працює 24 години на добу), вказаному на зворотній стороні Вашої банківської карти, і опишіть проблему. Ваш банк напевно піде Вам назустріч.</p>';
l10n.cardProblemOptions = ['<div>Перевірте коректність введення номера картки, строку дії, CVV / CVC коду.<br/>Переконайтеся в наявності грошових коштів на картці.</div>', '<div>Спробуйте вибрати інший метод оплати.</div>'];
l10n.cardAuth_cardCheck = 'Перевірка карти';
l10n.cardAuth_html_cardCheckComment = 'Необхідно впевнитися, що Ви дійсно являєтесь власником вказанної карти.<br/>Для цього ми заблокували незначну суму.<br/>В призначенні платежу вказаний 4-значний код у вигляді: CODE(XXXX).';
l10n.cardAuth_cvv = 'Перевірочний код';
l10n.cardAuth_confirm = 'Підтвердіть';
l10n.cardAuth_errorCode = 'Код був введений не вірно, уточніть і введіть код ще раз.';
l10n.cardAuth_noteCode = 'Введіть 4 цифри коду. Код можна дізнатись:';
l10n.cardAuth_titleSms = 'В SMS від банку';
l10n.cardAuth_noteSms = 'У тексті SMS-повідомлення';
l10n.cardAuth_titleBank = 'В інтернет-банку';
l10n.cardAuth_noteBank = 'У примітках до платежу';
l10n.cardAuth_titleCard = 'У техпідтримці банку';
l10n.cardAuth_noteCard = 'Телефон вказаний на звороті карти';
l10n.cardAuth_warnCode = 'Якщо не підтвердити код, через годину бронювання анулюється і заблокована сума повернеться на рахунок.';
l10n.cardAuth_close = 'Закрити і скористатися іншою картою';
l10n.passengersForm_title = 'Пасажири';
l10n.passengersForm_labels_gender = 'Стать';
l10n.passengersForm_labels_lastName = 'Прізвище';
l10n.passengersForm_labels_firstName = "Ім`я";
l10n.passengersForm_labels_birthDate = 'Дата народження';
l10n.passengersForm_labels_passCountry = 'Громадянство';
l10n.passengersForm_labels_passNumber = 'Серія и № документу';
l10n.passengersForm_placeholders_latin = 'Латинськими літерами';
l10n.passengersForm_placeholders_latinAndNumber = 'Лат. букви і цифри ';
l10n.passengersForm_placeholders_date = 'дд.мм.рррр';
l10n.passengersForm_add_adt = 'Дорослий';
l10n.passengersForm_add_child = 'дитина';
l10n.passengersForm_add_cnn = 'До 12 років';
l10n.passengersForm_add_inf = 'До 2 років без місця';
l10n.passengersForm_submit = 'Перейти до оплати';
l10n.passengersForm_errorRequire = 'Всі поля повинні бути заповнені';
l10n.passengersForm_errorWrongAgeType = 'Вік пасажира повинен відповідати категорії на всіх перельотах';
l10n.buyer = 'Покупець';
l10n.buyerComment = "Введіть адресу електронної пошти та номер мобільного телефону для зв'язку і відправки маршрутної квитанції.";
l10n.phone = 'Мобільний телефон';
l10n.email = 'Електронна пошта';
l10n.payment_title = 'Оплата';
l10n.payment_tableHead_base = 'Тариф';
l10n.payment_tableHead_taxe = 'Такси';
l10n.payment_tableHead_markup = 'Збір';
l10n.payment_tableHead_discount = 'Знижка';
l10n.payment_tableHead_amount = 'Загалом';
l10n.payment_tableHead_rules = 'Умови повернення і обміну';
l10n.payment_pay = 'Сплатити';
l10n.payment_book = 'Бронювати';
l10n.paymentVariants = {
	card: 'Банківською картою Visa або MasterCard',
	cash: 'Оплата готівкою',
	rapida: 'через рапіду',
	gds: 'напряму в авіакомпанію',
	payture: 'в авіакомпанію через платіжний шлюз',
	payture_r: 'в авіакомпанію через платіжний шлюз',
	payture_p: 'в авіакомпанію через платіжний шлюз',
	ua_cards: 'в авіакомпанію через платіжний шлюз',
	newstravel: 'м. Київ, вул. Щекавицька, 30/39, оф.6'
};
l10n.payment_transactions_toAk = 'будуть списані з Вашої карти авиакомпанією {airline}';
l10n.payment_transactions_toOtt = 'будуть списані через платіжний шлюз';
l10n.payment_transactions_toAkByOtt = 'будуть списані з Вашої карти';
l10n.payment_transactions_willBe = 'що складатиме';
l10n.payment_transactionsNote = 'Загальна вартість вашого замовлення може бути списана з Вашої карти у декілька транзакцій.';
l10n.payment_currencyConvertation = 'Конвертація {rate} здійснена за курсом';
l10n.payment_html_currencies = 'Якщо валюта карти відрізняється від валюти оплати,<br/>то конвертація буде здійснена <b>за курсом Вашого банку</b>.';
l10n.payment_ADT = 'дорослий';
l10n.payment_CNN = 'дитина';
l10n.payment_INF = 'немовля';
l10n.payment_linkRules = 'ознайомитись';
l10n.agreements_title = 'Умови, правила та обмеження';
l10n.agreements_label = 'Приймаю умови, правила та обмеження';
l10n.agreements_HTML = '<ul><li>Квитки не підлягають передачі, зміна імені та прізвища пасажира після виписки заборонена.</li><li>Вартість включає тариф, збори і такси, включаючи вартість перевезення багажу.</li><li>Вартість не включає можливі збори, що стягуються авіакомпанією (дод. багаж та інше).</li><li class="tw-discount_markup tw-invisible">Знижки і збори при поверненні квитка не повертаються.</li><li class="tw-markup tw-invisible">Збори при поверненні квитка не повертаються.</li><li class="tw-discount tw-invisible">Знижки при поверненні квитка не повертаються.</li></ul>';
l10n.agreementsBlank_HTML = '<p class="agreementsBlank"><a href="${twiket.setup.urls.customeragreement + "?id=" + id}" target="_blank">Лист підтвердження</a></li></p>';
l10n.SSLinfo = 'Передача інформації захищена сертифікатом SSL від компанії DigiCert.<br/>Сайт в повній мірі відповідає стандартам безпеки платіжних систем<br/>Visa та MasterCard (PCI compliance).';
l10n.cardHolder = ' (власник картки)';
l10n.posPassword = 'Код продавця';
l10n.makeorder_errorRequire = 'Всі поля повинні бути заповненні';
l10n.makeorder_errorWrongCardNumber = 'Номер карти введенний не вірно';
l10n.makeorder_errorExpiredCard = 'Не вірно введена дата срока дії карти';
l10n.makeorder_errorAgreements = 'Необхідно прийняти умови, правила та обмеження';
l10n.cancelReservation_comment = 'При незавершені оформлення заказу, заброньовані месця для зазначених нижче пасажирів будуть аннульовані:';
l10n.cancelReservation_unloadMessage = 'Ця сторінка просить Вас підтвердити, що Ви бажаєте піти — при цьому введені Вами дані можуть не зберігтись.';
l10n.completed_purchased = 'Заказ <b>{number}</b> {status}.<br/>Информація по заказу надіслана Вам на пошту <b>{email}</b><br/>Не забудьте роздрукувати маршрутну квитанцію, перейшовши за адресою <a target="_blank" class="tw-show_order" href="https://www.twiket.com/?c={encodedString}">www.twiket.com</a><br/>Бажаємо приємного польота!';
l10n.completed_booked = 'Заказы: <b>{number}</b> {status}.<br/>Информація по заказам надіслана Вам на пошту <b>{email}</b><br/>Сплатити закази необхідно на протязі <b>{time}.</b>';
l10n.completed_booked1 = 'Заказ <b>{number}</b> {status}.<br/>Информація по заказу надіслана Вам на пошту <b>{email}</b><br/>Сплатити заказ необхідно на протязі <b>{time}.</b>';
l10n.completed_status_CAPTURED = ['оформлен', 'оформлені'];
l10n.completed_status_CANCELED = ['скасован', 'скасовані'];
l10n.completed_status_ERROR = ['у обробці', 'у обробці'];
l10n.completed_status_WaitingForPayment = ['чекає на оплату', 'чекають на оплату'];
l10n.fareRules_link = 'Умови певернення та обміну';
l10n.fareRules_caution = '<div class="tw-title">Увага!</div>При обміні/поверненні до можливих штрафних санкцій авіакомпанії по правилам тарифа, додатково стягується сервісний збір:<ul><li>при поверненні &mdash; 15 доларів за пасажира;</li><li>при обміні &mdash; 25 доларів за пасажира.</li></ul>При не використанні одного з сегментів маршрута, наступні сегменти можуть бути автоматично анульовані авіакомпанією.';
l10n.fareRules_tariff1 = 'Правила застосування тарифу';
l10n.fareRules_tariff2 = 'Правила застосування тарифів';
l10n.fareRules_details = 'Будь ласка, ознайомтеся детальніше з умовами <span class="tw-link tw-dotted toPenalties">обміну</span>/повернення.';
l10n.fareRules_strict = '<span class="tw-warn">Якщо по перельоту використовується декілька різних правил/тарифів, то при обміні/поверненні застосовуються більш строгі правила.</span>';