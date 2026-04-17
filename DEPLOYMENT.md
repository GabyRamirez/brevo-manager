# Guia de Desplegament Pas a Pas: Brevo Preferences Manager

Aquesta guia detalla com portar l'aplicació des de GitHub fins al teu servidor en producció.

## Pas 1: Accés al Servidor
Primer, accedeix al teu servidor via SSH:
```bash
ssh usuari@ip-del-teu-servidor
```

## Pas 2: Clonar el Projecte
Un cop dins, navega fins al directori on guardes les aplicacions (per exemple, `/opt/`) i descarrega el codi:
```bash
cd /opt
git clone https://github.com/GabyRamirez/brevo-manager.git
cd brevo-manager
```

## Pas 3: Configurar les Variables d'Entorn
L'app necessita les claus de Brevo i la URL de la base de dades. Copia l'exemple i edita-lo:
```bash
cp .env.example .env
nano .env
```
> [!IMPORTANT]
> Assegura't que `DATABASE_URL` sigui `file:./dev.db` i que `BREVO_API_KEY` sigui la correcta.

## Pas 4: Preparar Docker
Crea el fitxer `docker-compose.yml` (si no l'has pujat al repo) per gestionar l'aplicació i la persistència de dades:

```yaml
services:
  app:
    build: .
    ports:
      - "3006:3000"  # S'ha assignat el port 3006 per evitar conflictes
    volumes:
      - ./prisma:/app/prisma
    restart: unless-stopped
```

## Pas 5: Aixecar el Contenidor
Construeix la imatge i posa en marxa l'aplicació:
```bash
docker-compose up -d --build
```
> [!NOTE]
> El primer cop pot trigar uns minuts ja que ha d'instal·lar totes les dependències i compilar Next.js.

## Pas 6: Configuració del Túnel de Cloudflare
Al teu "servidor 100" (on resideix `cloudflared`), actualitza la configuració del túnel:

1.  Edita el config: `nano /etc/cloudflared/config.yml`
2.  Afegeix l'entrada d'ingress:
    ```yaml
    - hostname: brevo-preferences.lainter.cat  # El domini que vulguis
      service: http://<IP_DEL_SERVIDOR_APP>:3000
    ```
3.  Reinicia el túnel si és necessari o deixa que detecti els canvis.
4.  Al panell de Cloudflare (web), crea un **CNAME** per `brevo-preferences` que apunti al teu ID de túnel.

---

## Manteniment i Actualitzacions
Si fas canvis al codi i vols actualitzar el servidor:
```bash
git pull origin main
docker-compose up -d --build
```
