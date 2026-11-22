Workout Logger 
Workout Logger är en applikation där användaren kan logga sina träningspass och kommentera hur setet kändes. Syftet är att man ska kunna logga sina pass för att kunna kolla tillbaka på hur passet såg ut och hur det kändes. Man kan lägga till flera träningspass samt ta bort.
Träningspassen sparas i LocalStorage och finns kvar efter att sidan uppdaterats. De synkroniseras inte mellan olika enheter
Webbapplikation: https://workout-logger-1plq.onrender.com
GitHub: https://github.com/Jonte1997/Labb-1---Docker-Render
Tekniker
React och Vite: Användargränssnitt och byggverktyg.
Node.js och Express: Serverar applikationen och hanterar API-anrop.
Docker: Paketerar applikationen i en container
GitHub Actions: Automatiserar byggprocess och driftsättning.
Render: Kör applikationen på internet.
Jag valde React och Vite för att enkelt kunna utveckla gränssnittet. Express används som en enkel server för både frontend och API.

Köra projektet 
Projektet använder Node.js 22.

För att köra projektet:

Installera beroenden:

npm ci


Starta Express:
Starta Vite i en annan terminal:
npm run server

öppna sedan en ny temrinal

npm run dev

Öppna http://localhost:5173.
För att köra produktionsversionen lokalt:
npm run build
npm run server
Öppna http://localhost:3000.

Docker
Sedan ska vi bygga Docker-imagen:

docker build -t workout-tracker .

Starta containern:
docker run --rm -p 3000:3000 workout-tracker
Öppna http://localhost:3000.
Docker används för att applikationen ska kunna köras i en container
Miljövariabler

APP_TITLE = Styr applikationens titel vi api/config
PORT = Bestämmer serverns port. 3000 lokalt
NODE_ENV = Anger produktionsläge

På Render använder jag APP_TITLE=Workout Logger och NODE_ENV=production. Render tilldelar serverporten automatiskt.
Render Deploy Hook sparas som en GitHub Actions-secret med namnet RENDER_DEPLOY_HOOK_URL.
Health check och loggning
Express-servern har tre endpoints:
GET /health - Returnerar {“status” : “ok” }
GET /api/config - returnerar titel
 /api/log-error - Demonstrerar ett fel

Health checken visar att Express-servern kan ta emot och besvara en HTTP-förfrågan.
På Render har jag konfigurerat /health som health Check Path.
Servern använder console.info() vid start och health check samt console.error() vid demonstrationsfel.
Felloggning kan testas i via terminalen.
Invoke-RestMethod -Uri "https://workout-logger-1plq.onrender.com/api/log-error" -Method Post
Endpointen returnerar avsiktligt HTTP 400. Jag har kollat att både informationsloggar och felloggar visas i Render Logs.
GitHub Actions och Render
Projektets workflow finns i .github/workflows/deploy.yml.
Vid en push till main sker följande:
GitHub Actions hämtar koden och installerar Node.js 22.
Beroenden installeras med npm ci.
React-applikationen byggs med npm run build.
Docker-imagen byggs med docker build.
Om byggena lyckas anropas Render Deploy Hook.
Renders Auto-Deploy är avstängt så att driftsättning endast startas via Deploy Hook. Render bygger därefter sin egen Docker-image från GitHub-koden.
Jag har verifierat att GitHub Actions lyckades och att Render driftsatte commiten med status Live.


Arkitektur
Koden ligger på github.  När jag pushar en ändring till main startar GitHub Actions automatiskt och bygger applikationen och Docker-imagen.
Om bygget lyckas skickas en signal till Render via Deploy Hook. Render bygger och startar sedan applikationen i en Docker-container.
Express servern levererar applikationen till webbläsaren Träningspassen sparas lokalt i webbläsarens localStorage.

Kostnadsmedveten drift
Plan: Jag använder Render Free, som är gratis.
Varför: Gratisplanen räcker för att demonstrera Docker och CI/CD.
Kostnad: Min Web Service kostar $0 per månad. Ytterliggare tjänster innebär större konstnader.
Resursbesparing: Jag använder en enda Web Service för React och Express och behöver ingen separat databas.
Begränsningar: Gratisplanen har begränsningar och kan bli långsam vid hög belastning.
Fler användare: Vid fler användare skulle jag eventuellt behöva utöka planen och dessutom lägga till en databas. 
Möjliga förbättringar
Applikationen saknar databas, användarinloggning och automatiserade tester. Dessa funktioner skulle kunna läggas till vid vidareutveckling.
