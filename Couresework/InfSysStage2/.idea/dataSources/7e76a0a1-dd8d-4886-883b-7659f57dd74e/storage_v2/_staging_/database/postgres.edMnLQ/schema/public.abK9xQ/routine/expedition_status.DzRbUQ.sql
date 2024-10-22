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

alter function expedition_status() owner to hokure;

