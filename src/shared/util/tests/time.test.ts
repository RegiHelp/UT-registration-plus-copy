import { describe, expect,it } from 'vitest';

import { sleep } from '../time';

describe('sleep', () => {
    it('should resolve after the specified number of milliseconds', async () => {
        const start = Date.now();
        const milliseconds = 1000;
        await sleep(milliseconds);
        const end = Date.now();
        const elapsed = end - start;
        expect(elapsed).toBeGreaterThanOrEqual(milliseconds);
    });
});
