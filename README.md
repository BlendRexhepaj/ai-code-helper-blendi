# 🖥️ AI Code Helper (Blendi) - Master Project v1.2

**AI Code Helper (Blendi)** është një aplikacion ueb "Full-Stack" i ndërtuar me teknologjitë më moderne për të ndihmuar studentët dhe programerët e rinj të gjenerojnë kod, të kërkojnë shpjegime të detajuara dhe të auditojnë kodin e tyre për dobësi të sigurisë kibernetike në kohë reale përmes Inteligjencës Artificiale (OpenAI).

---

## 🛠️ Arkitektura dhe Teknologjitë (Diplomat e Aplikuara)

Ky projekt pasqyron njohuritë e marra përgjatë 6 akademive të çertifikuara:
- **Front-End & React Developer:** React (Vite), Tailwind CSS v4, Axios, ReactMarkdown.
- **Back-End & Laravel Developer:** Laravel 11, REST API Architecture, MySQL (XAMPP).
- **Digital Security:** Autentikim me Token (Laravel Sanctum), Enkriptim fjalëkalimesh (Bcrypt), Mbrojtje e inputeve dhe trajtim i kontrolluar i gabimeve (Error Handling - Try/Catch).

---

## 🚀 Udhëzuesi i Përdoruesit (User Guide)

### 1. Autentikimi i Sigurt
- Gjatë hyrjes së parë në aplikacion, përdoruesit i shfaqet moduli i sigurisë (`AuthModal`).
- Përdoruesi mund të regjistrojë një llogari të re ose të kyçet në atë ekzistuese.
- Pas verifikimit, sistemi gjeneron një **Bearer Token** Kriptografik të cilin e ruan në sesion (`LocalStorage`).

### 2. Përdorimi i Editorit dhe Inteligjencës Artificiale
- **Gjenero Kod:** Shkruani një kërkesë në editorin e pajisur me numra rreshtash (Line Numbers) dhe AI do të krijojë një snippet kodi të pastër.
- **Shpjego Kod:** Ngjitni një kod të paqartë dhe AI do ta zbërthejë atë rresht për rresht në gjuhën shqipe.
- **Refaktoro Kod:** Optimizoni strukturën e kodit tuaj për performancë më të lartë.
- **Audito Sigurinë:** Skanoni kodin tuaj për dobësi kibernetike sipas standardeve **OWASP Top 10**.

### 3. Historiku i Integruar dhe Dizajni Responsive
- Çdo pyetje e ekzekutuar ruhet në databazën MySQL dhe lidhet me ID-në e përdoruesit.
- Historiku shfaqet në menunë anësore (Sidebar). Klikimi mbi të ngarkon të dhënat në ekran.
- **Për Mobile:** Në pajisje të vogla (telefona), moduli i historikut paloset dhe hapet përmes një butoni lundrues (Floating Action Button).

---

## ⚙️ Instalimi dhe Ekzekutimi Lokal (Setup Guide)

### Pjesa A: Konfigurimi i Backend-it (Laravel)
1. Navigoni te folderi i backend-it: `cd backend`
2. Instalo varësitë e PHP: `composer install`
3. Konfiguro skedarin `.env` me portën tuaj të MySQL (`3307`) dhe çelësin e OpenAI:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3307
   DB_DATABASE=ai_code_helper_db
   DB_USERNAME=root
   DB_PASSWORD=
   OPENAI_API_KEY=sk-proj-ZevendesoKeteMeCelesinTuaj
   ```
4. Ekzekuto migracionet për krijimin e tabelave: `php artisan migrate`
5. Ndize serverin e backend-it: `php artisan serve --port=8085`

### Pjesa B: Konfigurimi i Frontend-it (React)
1. Navigoni te folderi i frontend-it: `cd ../frontend`
2. Instalo paketat e Node: `npm install`
3. Ndize serverin e Vite: `npm run dev`
4. Hapni aplikacionin në browser te: `http://localhost:5173`

---

## 📸 Pamjet nga Aplikacioni (Screenshots Guide)

1. `screenshot-login.png` - Pamja e dritares së sigurisë për Login/Register.

2. `screenshot-dashboard.png` - Pamja e plotë e Dashboard-it të zi me fushën e inputit dhe rezultatin e ngjyrosur me Syntax Highlighting.
3. `screenshot-mobile.png` - Pamja responsive e aplikacionit siç duket në celular me sidebar-in e fshehur.
