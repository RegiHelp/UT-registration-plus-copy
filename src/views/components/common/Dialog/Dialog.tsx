import type { TransitionRootProps } from '@headlessui/react';
import { Dialog as HDialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import type { PropsWithChildren } from 'react';
import React, { Fragment } from 'react';

export interface _DialogProps {
    className?: string;
    title?: JSX.Element;
    description?: JSX.Element;
}

export type DialogProps = _DialogProps & Omit<TransitionRootProps<typeof HDialog>, 'children'>;

/**
 * A reusable popup component that can be used to display content on the page
 */
export default function Dialog(props: PropsWithChildren<DialogProps>): JSX.Element {
    const { children, className, open, onTransitionEnd, ...rest } = props;

    return (
        <Transition show={open} as={HDialog} {...rest}>
            <Transition.Child
                as={Fragment}
                enter='transition duration-300 ease-out'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='transition duration-150 ease-in delay-25'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
            >
                <div className={clsx('fixed inset-0 z-50 bg-neutral-500/25')} />
            </Transition.Child>
            <Transition.Child
                as={Fragment}
                enter='transition duration-400 ease-[cubic-bezier(0.15,0.3,0.2,1)]'
                enterFrom='transform scale-95 opacity-0'
                enterTo='transform scale-100 opacity-100'
                leave='transition duration-250 ease-[cubic-bezier(0.23,0.01,0.92,0.72)]'
                leaveFrom='transform scale-100 opacity-100'
                leaveTo='transform scale-95 opacity-0'
            >
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    <HDialog.Panel
                        className={clsx(
                            'z-99 max-h-[80vh] flex flex-col overflow-y-scroll rounded bg-white shadow-xl',
                            className
                        )}
                    >
                        {props.title && <HDialog.Title>{props.title}</HDialog.Title>}
                        {props.description && <HDialog.Description>{props.description}</HDialog.Description>}
                        {children}
                    </HDialog.Panel>
                </div>
            </Transition.Child>
        </Transition>
    );
}
