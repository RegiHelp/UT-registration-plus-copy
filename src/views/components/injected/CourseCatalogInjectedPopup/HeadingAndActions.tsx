import { Button } from '@views/components/common/Button/Button';
import { Chip, flagMap } from '@views/components/common/Chip/Chip';
import Divider from '@views/components/common/Divider/Divider';
import Text from '@views/components/common/Text/Text';
import React, { useState } from 'react';
import { background } from 'src/shared/messages';
import { Course } from 'src/shared/types/Course';
import Instructor from 'src/shared/types/Instructor';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import Add from '~icons/material-symbols/add';
import CalendarMonth from '~icons/material-symbols/calendar-month';
import CloseIcon from '~icons/material-symbols/close';
import Copy from '~icons/material-symbols/content-copy';
import Description from '~icons/material-symbols/description';
import Mood from '~icons/material-symbols/mood';
import Remove from '~icons/material-symbols/remove';
import Reviews from '~icons/material-symbols/reviews';

const { openNewTab, addCourse, removeCourse, openCESPage } = background;

interface HeadingAndActionProps {
    /* The course to display */
    course: Course;
    /* The active schedule */
    activeSchedule?: UserSchedule;
    /* The function to call when the popup should be closed */
    onClose: () => void;
}

export const handleOpenCalendar = async () => {
    //  Not sure if it's bad practice to export this
    const url = chrome.runtime.getURL('calendar.html');
    openNewTab({ url });
};

/**
 * Renders the heading component for the CoursePopup component.
 *
 * @param {HeadingAndActionProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const HeadingAndActions: React.FC<HeadingAndActionProps> = ({ course, onClose, activeSchedule }) => {
    const { courseName, department, number: courseNumber, uniqueId, instructors, flags, schedule } = course;
    const [courseAdded, setCourseAdded] = useState<boolean>(
        activeSchedule !== undefined ? activeSchedule.courses.some(course => course.uniqueId === uniqueId) : false
    );

    const capitalizeString = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const getInstructorFullName = (instructor: Instructor) => {
        const { firstName, lastName } = instructor;
        if (firstName === '') return lastName;
        return `${capitalizeString(firstName)} ${capitalizeString(lastName)}`;
    };

    const instructorString = instructors.map(getInstructorFullName).join(', ');
    const handleCopy = () => {
        navigator.clipboard.writeText(uniqueId.toString());
    };
    const handleOpenRateMyProf = async () => {
        const openTabs = instructors.map(instructor => {
            const instructorSearchTerm = getInstructorFullName(instructor);
            instructorSearchTerm.replace(' ', '+');
            const url = `https://www.ratemyprofessors.com/search/professors/1255?q=${instructorSearchTerm}`;
            return openNewTab({ url });
        });
        await Promise.all(openTabs);
    };
    const handleOpenCES = async () => {
        // TODO: does not look up the professor just takes you to the page
        const openTabs = instructors.map(instructor => {
            let { firstName, lastName } = instructor;
            firstName = capitalizeString(firstName);
            lastName = capitalizeString(lastName);
            return openCESPage({ instructorFirstName: firstName, instructorLastName: lastName });
        });
        await Promise.all(openTabs);
    };
    const handleOpenPastSyllabi = async () => {
        // not specific to professor
        const url = `https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?year=&semester=&department=${department}&course_number=${courseNumber}&course_title=${courseName}&unique=&instructor_first=&instructor_last=&course_type=In+Residence&search=Search`;
        openNewTab({ url });
    };
    const handleAddOrRemoveCourse = async () => {
        if (!activeSchedule) return;
        if (!courseAdded) {
            addCourse({ course, scheduleName: activeSchedule.name });
        } else {
            removeCourse({ course, scheduleName: activeSchedule.name });
        }
        setCourseAdded(prev => !prev);
    };
    return (
        <div className='w-full pb-3 pt-6'>
            <div className='flex flex-col'>
                <div className='flex items-center gap-1'>
                    <Text variant='h1' className='truncate'>
                        {courseName}
                    </Text>
                    <Text variant='h1' className='flex-1 whitespace-nowrap'>
                        {' '}
                        ({department} {courseNumber})
                    </Text>
                    <Button color='ut-burntorange' variant='single' icon={Copy} onClick={handleCopy}>
                        {uniqueId}
                    </Button>
                    <button className='bg-transparent p-0 btn' onClick={onClose}>
                        <CloseIcon className='h-7 w-7' />
                    </button>
                </div>
                <div className='flex gap-2.5 flex-content-center'>
                    {instructorString.length > 0 && (
                        <Text variant='h4' className='inline-flex items-center justify-center'>
                            with {instructorString}
                        </Text>
                    )}
                    <div className='flex-content-centr flex gap-1'>
                        {flags.map(flag => (
                            <Chip label={flagMap[flag]} />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col'>
                    {schedule.meetings.map(meeting => (
                        <Text variant='h4'>
                            {meeting.getDaysString({ format: 'long', separator: 'long' })}{' '}
                            {meeting.getTimeString({ separator: ' to ', capitalize: false })}
                            {meeting.location && (
                                <>
                                    {` in `}
                                    <Text variant='h4' className='text-ut-burntorange underline'>
                                        {meeting.location.building}
                                    </Text>
                                </>
                            )}
                        </Text>
                    ))}
                </div>
            </div>
            <div className='my-3 flex flex-wrap items-center gap-[15px]'>
                <Button variant='filled' color='ut-burntorange' icon={CalendarMonth} onClick={handleOpenCalendar} />
                <Divider type='solid' color='ut-offwhite' className='h-7' />
                <Button variant='outline' color='ut-blue' icon={Reviews} onClick={handleOpenRateMyProf}>
                    RateMyProf
                </Button>
                <Button variant='outline' color='ut-teal' icon={Mood} onClick={handleOpenCES}>
                    CES
                </Button>
                <Button variant='outline' color='ut-orange' icon={Description} onClick={handleOpenPastSyllabi}>
                    Past Syllabi
                </Button>
                <Button
                    variant='filled'
                    color={!courseAdded ? 'ut-green' : 'ut-red'}
                    icon={!courseAdded ? Add : Remove}
                    onClick={handleAddOrRemoveCourse}
                >
                    {!courseAdded ? 'Add Course' : 'Remove Course'}
                </Button>
            </div>
            <Divider />
        </div>
    );
};

export default HeadingAndActions;
