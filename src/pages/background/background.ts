import type { BACKGROUND_MESSAGES } from '@shared/messages';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import type { UserSchedule } from '@shared/types/UserSchedule';
import updateBadgeText from '@shared/util/updateBadgeText';
import type { DataChange } from 'chrome-extension-toolkit';
import { MessageListener } from 'chrome-extension-toolkit';

import onInstall from './events/onInstall';
import onServiceWorkerAlive from './events/onServiceWorkerAlive';
import onUpdate from './events/onUpdate';
import browserActionHandler from './handler/browserActionHandler';
import calendarBackgroundHandler from './handler/calendarBackgroundHandler';
import CESHandler from './handler/CESHandler';
import tabManagementHandler from './handler/tabManagementHandler';
import userScheduleHandler from './handler/userScheduleHandler';

onServiceWorkerAlive();

/**
 * will be triggered on either install or update
 * (will also be triggered on a user's sync'd browsers (on other devices)))
 */
chrome.runtime.onInstalled.addListener(details => {
    switch (details.reason) {
        case 'install':
            onInstall();
            break;
        case 'update':
            onUpdate();
            break;
        default:
            break;
    }
});

// initialize the message listener that will listen for messages from the content script
const messageListener = new MessageListener<BACKGROUND_MESSAGES>({
    ...browserActionHandler,
    ...tabManagementHandler,
    ...userScheduleHandler,
    ...CESHandler,
    ...calendarBackgroundHandler,
});

messageListener.listen();

UserScheduleStore.listen('schedules', async (schedules: DataChange<UserSchedule[]>) => {
    const index: number = await UserScheduleStore.get('activeIndex');
    const numCourses: number | undefined = schedules.newValue[index]?.courses?.length;
    if (!numCourses) return;

    updateBadgeText(numCourses);
});

UserScheduleStore.listen('activeIndex', async ({ newValue }) => {
    const schedules = await UserScheduleStore.get('schedules');
    const numCourses = schedules[newValue]?.courses?.length;
    if (!numCourses) return;

    updateBadgeText(numCourses);
});
