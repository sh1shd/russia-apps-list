#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const paths = {
  applicationsJson: path.join(__dirname, 'data', 'apps.json'),
  happConfig: path.join(__dirname, 'raw', 'happ.txt')
}

const applications = {
  load: () => {
    if (!fs.existsSync(paths.applicationsJson)) return [];

    const raw = fs.readFileSync(paths.applicationsJson, 'utf8');

    try {
      const obj = JSON.parse(raw);

      if (Array.isArray(obj.apps)) return obj.apps.slice();

      return [];
    } catch (e) {
      console.error('Failed to parse data/apps.json:', e.message);

      process.exit(1);
    }
  },
  save: (apps) => {
    const dir = path.dirname(paths.applicationsJson);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const payload = { apps };

    fs.writeFileSync(paths.applicationsJson, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  }
}

const cli = {
  clean: () => {
    const apps = applications.load();

    const deduped = Array.from(new Set(apps));

    deduped.sort((a, b) => a.localeCompare(b));

    applications.save(deduped);

    console.log(`Cleaned data/apps.json — ${apps.length} -> ${deduped.length} apps`);
  },
  generateHappConfiguration: () => {
    const apps = applications.load();
    const list = apps.join(',');
    const dir = path.dirname(paths.happConfig);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const content = `#per-app-proxy-mode: bypass\n#per-app-proxy-list: ${list}\n\nvless://00000000-0000-0000-0000-000000000000@127.0.0.1:80?type=tcp&encryption=none&security=none#Тестовый inbound`;

    fs.writeFileSync(paths.happConfig, content, 'utf8');

    console.log(`Generated raw/happ.txt (${apps.length} apps)`);
  }
}

const index = () => {
  const cmd = process.argv[2];

  if (!cmd) {
    process.exit(0);
  }

  switch (cmd) {
    case "clean":
      cli.clean()
      break;
    case "genHapp":
      cli.generateHappConfiguration()
      break;
    default:
      console.error('Unknown command:', cmd);
      printUsage();
      process.exit(1);
      break;
  }
}

index()