-- Set logo_url for each bookmaker.
-- Run once in Supabase SQL editor.

update public.bookmakers set logo_url = '/logos/paripesa.png' where slug = 'paripesa';
update public.bookmakers set logo_url = '/logos/1xbet.png'   where slug = '1xbet';
update public.bookmakers set logo_url = '/logos/melbet.png'  where slug = 'melbet';
