-- Set logo_url for each bookmaker.
-- Run once in Supabase SQL editor.

update public.bookmakers set logo_url = '/paripesa.webp' where slug = 'paripesa';
update public.bookmakers set logo_url = '/1xbet.webp'    where slug = '1xbet';
update public.bookmakers set logo_url = '/melbet.webp'   where slug = 'melbet';
