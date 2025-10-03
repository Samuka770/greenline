#!/usr/bin/env node
/**
 * Simple CLI to manage src/data/projects.json
 * Supports list, get, add, update, remove commands.
 * Works with Node ESM (package.json has type: module).
 *
 * Examples (PowerShell):
 *   node scripts/projects.mjs list
 *   node scripts/projects.mjs get --name "Caure Grupo 1"
 *   node scripts/projects.mjs update --name "Caure Grupo 1" --set credits=12345 biome="Amazônia"
 *   node scripts/projects.mjs add --name "Novo Projeto" --link "https://..." --country Brasil --state Acre --biome Amazônia --vintage 09/2025 --credits 1000
 *   node scripts/projects.mjs remove --name "Projeto Antigo"
 *   node scripts/projects.mjs rename --name "Caure Grupo 1" --to "Caure Grupo 1A"
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const PROJECTS_PATH = path.resolve('src/data/projects.json');

function load() {
  const raw = fs.readFileSync(PROJECTS_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao fazer parse de projects.json:', e.message);
    process.exit(1);
  }
}

function save(data) {
  const sorted = data.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  fs.writeFileSync(PROJECTS_PATH, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
}

function parseArgs(argv) {
  const args = {};
  let currentKey = null;
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith('--')) {
      currentKey = token.slice(2);
      // default true for flags
      args[currentKey] = true;
    } else if (currentKey) {
      args[currentKey] = token;
      currentKey = null;
    } else if (!args._) {
      args._ = [token];
    } else {
      args._.push(token);
    }
  }
  if (!args._) args._ = [];
  return args;
}

function printHelp() {
  console.log(`Uso: node scripts/projects.mjs <comando> [opções]\n\nComandos:\n  list                    Lista todos os projetos (nome + créditos)\n  get --name <nome>       Mostra JSON completo de um projeto\n  add --name N --credits 123 ... outros campos\n  update --name N --set campo=valor outro=valor\n  rename --name N --to NOVO_NOME\n  remove --name N         Remove um projeto\n  inc --name N --credits 500  Incrementa (ou decrementa se negativo) créditos\n\nCampos suportados: name, link, country, state, biome, vintage, credits\n`);
}

function ensureName(args) {
  if (!args.name) {
    console.error('É necessário fornecer --name');
    process.exit(1);
  }
}

function commandList(projects) {
  console.log('Total:', projects.length);
  for (const p of projects) {
    console.log('-', p.name, `(credits: ${p.credits})`);
  }
}

function commandGet(projects, args) {
  ensureName(args);
  const p = projects.find(p => p.name === args.name);
  if (!p) {
    console.error('Projeto não encontrado');
    process.exit(1);
  }
  console.log(JSON.stringify(p, null, 2));
}

function parseSetList(list) {
  const obj = {};
  for (const item of list) {
    const eq = item.indexOf('=');
    if (eq === -1) {
      console.error('Formato inválido (use campo=valor):', item);
      process.exit(1);
    }
    const key = item.slice(0, eq);
    let value = item.slice(eq + 1);
    if (key === 'credits') {
      const n = Number(value);
      if (Number.isNaN(n)) {
        console.error('credits precisa ser número');
        process.exit(1);
      }
      value = n;
    }
    obj[key] = value;
  }
  return obj;
}

function commandAdd(projects, args) {
  ensureName(args);
  if (projects.some(p => p.name === args.name)) {
    console.error('Já existe projeto com esse nome');
    process.exit(1);
  }
  const project = {
    name: args.name,
    link: args.link || '',
    country: args.country || 'Brasil',
    state: args.state || '',
    biome: args.biome || '',
    vintage: args.vintage || '',
    credits: args.credits ? Number(args.credits) : 0
  };
  if (Number.isNaN(project.credits)) {
    console.error('credits inválido');
    process.exit(1);
  }
  projects.push(project);
  save(projects);
  console.log('Adicionado.');
}

function commandUpdate(projects, args) {
  ensureName(args);
  const idx = projects.findIndex(p => p.name === args.name);
  if (idx === -1) {
    console.error('Projeto não encontrado');
    process.exit(1);
  }
  const setIndex = args._.indexOf('--set');
  if (setIndex === -1) {
    console.error('Use --set campo=valor ...');
    process.exit(1);
  }
  const setItems = args._.slice(setIndex + 1);
  if (!setItems.length) {
    console.error('Nenhum campo para atualizar');
    process.exit(1);
  }
  const changes = parseSetList(setItems);
  const updated = { ...projects[idx], ...changes };
  if ('credits' in changes) {
    updated.credits = Number(changes.credits);
    if (Number.isNaN(updated.credits)) {
      console.error('credits inválido');
      process.exit(1);
    }
  }
  projects[idx] = updated;
  save(projects);
  console.log('Atualizado.');
}

function commandRename(projects, args) {
  ensureName(args);
  if (!args.to) {
    console.error('Forneça --to <novo nome>');
    process.exit(1);
  }
  if (projects.some(p => p.name === args.to)) {
    console.error('Já existe projeto com o novo nome');
    process.exit(1);
  }
  const p = projects.find(p => p.name === args.name);
  if (!p) {
    console.error('Projeto não encontrado');
    process.exit(1);
  }
  p.name = args.to;
  save(projects);
  console.log('Renomeado.');
}

function commandRemove(projects, args) {
  ensureName(args);
  const lenBefore = projects.length;
  const filtered = projects.filter(p => p.name !== args.name);
  if (filtered.length === lenBefore) {
    console.error('Projeto não encontrado');
    process.exit(1);
  }
  save(filtered);
  console.log('Removido.');
}

function commandInc(projects, args) {
  ensureName(args);
  const p = projects.find(p => p.name === args.name);
  if (!p) {
    console.error('Projeto não encontrado');
    process.exit(1);
  }
  if (!args.credits) {
    console.error('Forneça --credits <valor a somar>');
    process.exit(1);
  }
  const delta = Number(args.credits);
  if (Number.isNaN(delta)) {
    console.error('Valor inválido para credits');
    process.exit(1);
  }
  p.credits += delta;
  save(projects);
  console.log('Créditos atualizados para', p.credits);
}

function main() {
  const argv = process.argv.slice(2);
  if (!argv.length || argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    return;
  }
  const command = argv[0];
  const args = parseArgs(argv.slice(1));
  const projects = load();
  switch (command) {
    case 'list':
      commandList(projects, args); break;
    case 'get':
      commandGet(projects, args); break;
    case 'add':
      commandAdd(projects, args); break;
    case 'update':
      commandUpdate(projects, args); break;
    case 'rename':
      commandRename(projects, args); break;
    case 'remove':
      commandRemove(projects, args); break;
    case 'inc':
      commandInc(projects, args); break;
    default:
      console.error('Comando desconhecido');
      printHelp();
      process.exit(1);
  }
}

main();
