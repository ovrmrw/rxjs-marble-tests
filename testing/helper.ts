import * as lodash from 'lodash';
import { assert } from 'chai';


export function assertDeepEqual(actual: any, exptected: any): void {
  let messages: string[] = ['\n'];
  if (!lodash.isEqual(actual, exptected)) {
    messages.push('='.repeat(10) + ' ACTUAL ' + '='.repeat(10));
    messages.push(JSON.stringify(actual, null, 2));
    messages.push('='.repeat(10) + ' EXPECTED ' + '='.repeat(10));
    messages.push(JSON.stringify(exptected, null, 2));
    messages.push('\n');
  }
  assert.deepEqual(actual, exptected, messages.join('\n'));
}



export function noop(): void { }
