import { background } from '@shared/messages';
import type { Course } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { CourseColors } from '@shared/types/ThemeColors';
import { pickFontColor } from '@shared/util/colors';
import { StatusIcon } from '@shared/util/icons';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';

/**
 * Props for PopupCourseBlock
 */
export interface PopupCourseBlockProps {
    className?: string;
    course: Course;
    colors: CourseColors;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dragHandleProps?: any;
}

/**
 * The "course block" to be used in the extension popup.
 *
 * @param props PopupCourseBlockProps
 */
export default function PopupCourseBlock({
    className,
    course,
    colors,
    dragHandleProps,
}: PopupCourseBlockProps): JSX.Element {
    // text-white or text-black based on secondaryColor
    const fontColor = pickFontColor(colors.primaryColor);
    const formattedUniqueId = course.uniqueId.toString().padStart(5, '0');

    const handleClick = async () => {
        await background.switchToCalendarTab({ uniqueId: course.uniqueId });
        window.close();
    };

    return (
        <button
            style={{
                backgroundColor: colors.primaryColor,
            }}
            className={clsx(
                'h-full w-full inline-flex items-center justify-center gap-1 rounded pr-3 cursor-pointer focusable text-left',
                className
            )}
            onClick={handleClick}
        >
            <div
                style={{
                    backgroundColor: colors.secondaryColor,
                }}
                className='flex cursor-move items-center self-stretch rounded rounded-r-0'
                {...dragHandleProps}
            >
                <DragIndicatorIcon className='h-6 w-6 text-white' />
            </div>
            <Text className={clsx('flex-1 py-3.5 truncate', fontColor)} variant='h1-course'>
                <span className='px-0.5 font-450'>{formattedUniqueId}</span> {course.department} {course.number} &ndash;{' '}
                {course.instructors.length === 0 ? 'Unknown' : course.instructors.map(v => v.lastName)}
            </Text>
            {course.status !== Status.OPEN && (
                <div
                    style={{
                        backgroundColor: colors.secondaryColor,
                    }}
                    className='ml-1 flex items-center justify-center justify-self-end rounded p-1px text-white'
                >
                    <StatusIcon status={course.status} className='h-5 w-5' />
                </div>
            )}
        </button>
    );
}
