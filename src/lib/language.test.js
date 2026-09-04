import assert from 'node:assert/strict';
import test from 'node:test';
import { BaboonLanguage, LanguageError } from './language.js';

test('executes stack operations and returns the original state shape', () => {
  const language = new BaboonLanguage();
  for (const pose of ['one', 'zero', 'plus', 'one', 'dup2']) language.doPose(pose);

  assert.deepEqual(language.getState(), {
    program_text: ['one', 'zero', 'plus', 'one', 'dup2'],
    program_emojis: ['1️⃣', '0️⃣', '➕', '1️⃣', '📝📝'],
    stack: [1, 1, 1, 1]
  });
});

test('defines and runs a function', () => {
  const language = new BaboonLanguage();
  for (const pose of ['startFunc', 'one', 'one', 'plus', 'endFunc', 'runFunc']) {
    language.doPose(pose);
  }

  assert.deepEqual(language.getState().stack, [2]);
});

test('undo restores the preceding successful state', () => {
  const language = new BaboonLanguage();
  language.doPose('zero');
  language.doPose('one');
  language.doPose('undo');

  assert.deepEqual(language.getState().stack, [0]);
  assert.deepEqual(language.getState().program_text, ['zero']);
});

test('undo restores the function definition from the target state', () => {
  const language = new BaboonLanguage();
  for (const pose of ['startFunc', 'one', 'endFunc', 'zero']) language.doPose(pose);

  language.doPose('undo');
  assert.deepEqual(language.runFunction, ['one']);

  language.doPose('undo');
  assert.deepEqual(language.runFunction, []);
});

test('reports the same user-facing stack errors as the Python runtime', () => {
  const language = new BaboonLanguage();
  assert.throws(() => language.doPose('plus'), new LanguageError('plus requires two elements on stack'));
  assert.deepEqual(language.getState().program_text, []);
});
