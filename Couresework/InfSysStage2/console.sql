--Таблица Route
CREATE TABLE Route(
    route_id SERIAL PRIMARY KEY,
    start_point VARCHAR(255) NOT NULL,
    end_point VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    CHECK(duration > 0)
);

-- ТАблица Location
CREATE TABLE Location (
    location_id SERIAL PRIMARY KEY,
    location_name VARCHAR(255) NOT NULl,
    coordinates VARCHAR(255) NOT NULL UNIQUE,
    route_id INT,
    permit_type VARCHAR(255) NOT NULL,
    hard_level INT,
    overall_rating FLOAT,
    FOREIGN KEY (route_id) REFERENCES Route(route_id) ON DELETE CASCADE
);

-- Таблица Hazard
CREATE TABLE Hazard (
    hazard_id SERIAL PRIMARY KEY,
    description TEXT,
    risk_level INT,
    CHECK (risk_level >= 0 AND risk_level <= 10),
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES Location(location_id) ON DELETE CASCADE
);

-- Таблица Vehicle
CREATE TABLE Vehicle (
    vehicle_id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    CHECK(capacity > 0),
    description TEXT,
    status VARCHAR(50),
    fuel_consumtion FLOAT NOT NULL,
    fuel_type VARCHAR(50) NOT NULL,
    reservation BOOLEAN NOT NULL,
    price FLOAT NOT NULL,
    CHECK(price > 0)
);

-- Таблица Equipment
CREATE TABLE Equipment (
    equipment_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    CHECK (price > 0),
    status VARCHAR(50),
    reservation BOOLEAN NOT NULL,
    type VARCHAR(50) NOT NULL
);

-- Таблица Certificate
CREATE TABLE Certificate (
    certificate_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    equipment_id INT,
    status VARCHAR(50),
    serial_number VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (equipment_id) REFERENCES Equipment(equipment_id) ON UPDATE CASCADE
);

-- Таблица Supplies
CREATE TABLE Supplies (
    supply_id SERIAL PRIMARY KEY,
    category VARCHAR(255),
    quantity INT,
    CHECK(quantity > 0),
    description TEXT
);

-- Таблица User_info
CREATE TABLE User_info (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) UNIQUE,
    vehicle_type VARCHAR(255),
    exp_role VARCHAR(255),
    skill VARCHAR(255),
    about_user TEXT
);

-- Таблица Role
CREATE TABLE Role (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Таблица Expedition
CREATE TABLE Expedition (
    expedition_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL ,
    end_date DATE NOT NULL,
    CHECK (end_date > start_date),
    description TEXT,
    route_id INT,
    status VARCHAR(50),
    FOREIGN KEY (route_id) REFERENCES Route(route_id)
);


-- Таблица Report
CREATE TABLE Report (
    report_id SERIAL PRIMARY KEY,
    expedition_id INT,
    nomination VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (expedition_id) REFERENCES Expedition(expedition_id) ON DELETE CASCADE
);

-- Таблица Request
CREATE TABLE Request (
    request_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(50),
    reason_for_refusal TEXT,
    expedition_id INT,
    FOREIGN KEY (expedition_id) REFERENCES Expedition(expedition_id)
);

-- Таблица Permit
CREATE TABLE Permit (
    permit_id SERIAL PRIMARY KEY,
    permit_type VARCHAR(255) NOT NULL,
    issue_date DATE,
    authority_name VARCHAR(255) NOT NULL,
    expedition_id INT,
    FOREIGN KEY (expedition_id) REFERENCES Expedition(expedition_id)
);


CREATE OR REPLACE FUNCTION unique_phone()
RETURNS TRIGGER AS $unique_phone$
BEGIN
    IF EXISTS(
        SELECT 1
        FROM User_info
        WHERE phone_number = new.phone_number AND user_id <> new.user_id
    ) THEN
        RAISE EXCEPTION 'Номер телефона должен быть уникальным';
    end if;
    IF NEW.phone_number !~ '^[0-9]+$' THEN
        RAISE EXCEPTION 'Номер телефона не должен содержать ничего кроме цифр';
    end if;

    RETURN NEW;
END;
$unique_phone$ LANGUAGE plpgsql;

CREATE TRIGGER check_phone
BEFORE INSERT OR UPDATE ON User_info
FOR EACH ROW
EXECUTE FUNCTION unique_phone();

create function expedition_status() returns trigger
    language plpgsql
as
$expedition_status$
BEGIN
    IF NEW.status IS NOT NULL THEN
        IF NEW.status NOT IN ('формируется','в процессе','заверешена') THEN
            RAISE EXCEPTION 'Некорректный статус';
        END IF;
    END IF;
    RETURN NEW;
END;
$expedition_status$;


CREATE TRIGGER check_expedition_status
BEFORE INSERT OR UPDATE ON Expedition
FOR EACH ROW
EXECUTE FUNCTION expedition_status();

INSERT INTO Route (start_point, end_point, duration) VALUES
('город Китулим', 'Мыс Дежнева', 58),
('Архангельск', 'Земля Франца-Иосифа', 589),
('Чита', 'Палеовулкан Сахюрта', 118);

INSERT INTO Location (location_name, coordinates, route_id, permit_type, hard_level, overall_rating) VALUES
('Трелобитские пещеры', '55.7539,37.6208', 1, 'Археологические взыскания', 2, 4.5),
('Перевал Дуроо', '48.8584,2.2945', 2, 'Проведение посиковых работ', 1, 4.8),
('Цугольский доцан', '40.6892,-74.0445', 3, 'Проведение морской экспедиции', 3, 4.9);

INSERT INTO Hazard (description, risk_level, location_id) VALUES
('Оползень', 7, 1),
('Обвал камней', 5, 2),
('Утечка ядовитых веществ', 6, 3);

INSERT INTO Vehicle (type, model, capacity, description, status, fuel_consumtion, fuel_type, reservation, price) VALUES
('Моторная лодка', 'Magnum', 6, 'Быстрая моторная лодка', 'доступен', 15.5, 'Бензин', TRUE, 15000),
('Внедорожник', 'Toyota Land Cruiser', 7, 'Внедорожник с высокой проходимостью', 'в ремонте', 12.0, 'Бензин', FALSE, 40000),
('Снегоход', 'Yamaha', 1, 'Снегоход по дешёвой цене', 'доступен', 8.0, 'Дизель', TRUE, 30000);

INSERT INTO Equipment (name, description, price, status, reservation, type) VALUES
('Снегоступы', 'Специальное снаряжени для передвижения по снегу', 7500, 'доступен', TRUE, 'Навигация'),
('Палатка 4 местная', 'Большая удобная палатка', 4800, 'доступен', TRUE, 'Палатки'),
('Топор', 'Крепкий топор для древесины', 1660, 'доступен', FALSE, 'Инструмент');


INSERT INTO Certificate (name, description, equipment_id, status, serial_number) VALUES
('Сертификат на снегоступы', 'Сертификат на использование снегоступ', 1, 'активен', 'SNOW12345'),
('Сертификат на палатку', 'Сертификат на использование палатки', 2, 'истек', 'TENT67890'),
('Сертификат на топор', 'Сертификат на использование топора', 3, 'активен', 'SLEEP112');


INSERT INTO Supplies (category, quantity, description) VALUES
('Еда', 50, 'Консервированные продукты на 5 дней'),
('Вода', 100, 'Бутылированная вода для экспедиции'),
('Бинты', 10, 'Бинты для серьёзных ушибов');


INSERT INTO User_info (username, email, password, name, surname, phone_number, vehicle_type, exp_role, skill, about_user) VALUES
('hokure', 'hokure.04@mail.com', 'Password123', 'Александр', 'Каргин', '89991112233', null, 'Участник', null, 'Не очень опытный турсит'),
('king_d', 'petrov@mail.com', 'SecurePass456', 'Петр', 'Иванов', '89992223344', 'Внедорожник', 'Водитель', 'Вождение по бездорожью', 'Специалист по транспортировке'),
('master', 'pushkin@mail.com', 'MyPass789', 'Александр', 'Дюма', '89993334455', 'Моторная лодка', 'Админ группы', 'Ориентирование на местности', 'Люблю путешествовать');


INSERT INTO Role (name) VALUES
('Администратор'),
('Участник');


INSERT INTO Expedition (name, start_date, end_date, description, route_id, status) VALUES
('Экспедиция на Эльбрус', '2024-06-01', '2024-06-15', 'Горная экспедиция на Эльбрус', 1, 'формируется'),
('Исследование Чукостких островов', '2024-07-01', '2024-07-20', 'Научная экспедиция на Чукотские острова', 2, 'формируется'),
('Путешествие по Транссибирской магистрали', '2024-08-01', '2024-08-10', 'Сбор материалов в процессе путешествия', 3, 'формируется');


INSERT INTO Report (nomination, description) VALUES
('Исследовать пещеры на наличие редкой руды', 'Ничего не было обнаружено'),
('Собрать горную породу для дальнейшего изучения', 'Получилось собрать большее количество чем изначалаьно предоплагалось'),
('Поиски необычных форм жизни', 'Был открыт новый подвид мухи названный Бйонсе');


INSERT INTO Request (username, description, status, reason_for_refusal, expedition_id) VALUES
('ivanov', 'Хочу принять участие в экспедиции на Эльбрус', 'принят', NULL, 1),
('hokure', 'Прошу включить в состав исследовательской группы по исселдованию островов', 'отказан', 'Нет подходящих навыков', 2),
('mister', 'Подаю заявку на участие в транссибирском путешествии', 'принят', NULL, 3);

INSERT INTO Permit (permit_type, issue_date, authority_name, expedition_id) VALUES
('Горный пропуск', '2024-05-15', 'Федерация Альпинизма', 1),
('Научный пропуск', '2024-06-20', 'Арктическая исследовательская комиссия', 2),
('Туристическая лицензия', '2024-07-20', 'Министерство Туризма', 3);

-- Функция для получения всех опасных мест на маршруте
CREATE OR REPLACE FUNCTION get_route_hazards(p_route_id INT)
RETURNS TABLE (hazard_description TEXT, risk_level INT)
LANGUAGE plpgsql AS $get_route_hazards$
    BEGIN
       RETURN QUERY
        SELECT h.description, h.risk_level
        FROM Hazard h
        JOIN Location L on h.location_id = L.location_id
        WHERE l.route_id = p_route_id;
    END;
$get_route_hazards$;

-- Функция для подсчёта количества участников
CREATE OR REPLACE FUNCTION get_count(p_expedition_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $get_count$
    DECLARE
        participant_count INT;
    BEGIN
       SELECT COUNT(*)
        INTO participant_count
        FROM Request
        WHERE expedition_id = p_expedition_id AND status = 'принят';
       RETURN participant_count;
    END;
$get_count$;

CREATE INDEX idx_username ON User_info (username, password);
CREATE INDEX idx_status ON Expedition (status);
CREATE INDEX idx_name ON Expedition (name);
CREATE INDEX idx_for_vehicle ON Vehicle (type, model);
CREATE INDEX idx_for_equipment ON Equipment (name);

-- 2 варианта реализации
-- первый
 DROP TABLE IF EXISTS Permit CASCADE;
 DROP TABLE IF EXISTS Request CASCADE;
 DROP TABLE IF EXISTS Report CASCADE;
 DROP TABLE IF EXISTS Expedition CASCADE;
 DROP TABLE IF EXISTS Role CASCADE;
 DROP TABLE IF EXISTS User_info CASCADE;
 DROP TABLE IF EXISTS Supplies CASCADE;
 DROP TABLE IF EXISTS Certificate CASCADE;
 DROP TABLE IF EXISTS Equipment CASCADE;
 DROP TABLE IF EXISTS Vehicle CASCADE;
 DROP TABLE IF EXISTS Hazard CASCADE;
 DROP TABLE IF EXISTS Location CASCADE;
 DROP TABLE IF EXISTS Route CASCADE;

-- -- второй значительно проще
 DROP DATABASE Expedition;
