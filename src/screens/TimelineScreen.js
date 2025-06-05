import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Button } from 'react-native';
import { Color } from '../assets/color/Color';
import { scale } from 'react-native-size-matters';
import Header from '../components/Header';
import ScreenWrapper from '../components/ScreenWrapper';
import CustomModal from '../components/Modal';

const { width: screenWidth } = Dimensions.get('window');

const events = [
    { id: '11', stage: 'STAGE', name: 'Today Event 1', start: '14:00', end: '16:00', date: '2025-06-05' },
    { id: '12', stage: 'MOBIUS', name: 'Today Event 2', start: '18:00', end: '20:00', date: '2025-06-05' },
    { id: '19', stage: 'PRIZMA', name: 'Overnight Part 1', start: '23:00', end: '01:00', date: '2025-06-05' },
    { id: '16', stage: 'STAGE', name: 'Tomorrow Event', start: '10:00', end: '11:00', date: '2025-06-06' },
    { id: '20', stage: 'PRIZMA', name: 'Overnight Part 2', start: '00:00', end: '01:00', date: '2025-06-06' },
    { id: '21', stage: 'MEADOW', name: 'Morning Set', start: '08:30', end: '10:30', date: '2025-06-06' },
    { id: '17', stage: 'MOBIUS', name: 'Day 3 Event', start: '13:00', end: '15:00', date: '2025-06-07' },
    { id: '22', stage: 'RODNYA', name: 'Sunday Session', start: '16:00', end: '19:00', date: '2025-06-08' },
    { id: '23', stage: 'FLOWER', name: 'Midweek Groove', start: '20:00', end: '22:00', date: '2025-06-10' },
    { id: '24', stage: 'GHOSTY', name: 'Late Night Flow', start: '22:30', end: '00:30', date: '2025-06-11' },
    { id: '18', stage: 'PRIZMA', name: 'Last Day Event', start: '21:00', end: '23:00', date: '2025-06-12' },
    { id: '25', stage: 'GHOSTY', name: 'Late Night Flow Cont.', start: '00:00', end: '00:30', date: '2025-06-12' },
    { id: '13', stage: 'PRIZMA', name: 'Past Event', start: '16:00', end: '17:00', date: '2025-06-04' },
    { id: '14', stage: 'STAGE', name: 'Future Event Far', start: '10:00', end: '11:00', date: '2025-06-13' },
];

const TOTAL_HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = TOTAL_HOURS_PER_DAY * MINUTES_PER_HOUR;

const addDays = (dateString, days) => {
    const date = new Date(dateString + 'T00:00:00');
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * MINUTES_PER_HOUR + minutes;
};

const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR) % TOTAL_HOURS_PER_DAY;
    const mins = totalMinutes % MINUTES_PER_HOUR;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const getMultiDayEvents = (dates) => {
    const allEvents = [];
    let totalMinutesOffset = 0;

    dates.forEach((date) => {
        events.forEach(event => {
            const eventDate = event.date;
            const startMinutes = timeToMinutes(event.start);
            const endMinutes = timeToMinutes(event.end);
            const isCrossDay = endMinutes < startMinutes;

            const eventFallsOnCurrentVisibleDate = eventDate === date;
            const eventCrossesIntoCurrentVisibleDate = isCrossDay && addDays(eventDate, 1) === date;

            if (!isCrossDay) {
                if (eventFallsOnCurrentVisibleDate) {
                    allEvents.push({
                        ...event,
                        adjustedStart: startMinutes + totalMinutesOffset,
                        adjustedEnd: endMinutes + totalMinutesOffset,
                        displayStart: event.start,
                        displayEnd: event.end,
                        originalDate: date
                    });
                }
            } else {
                if (eventFallsOnCurrentVisibleDate) {
                    allEvents.push({
                        ...event,
                        adjustedStart: startMinutes + totalMinutesOffset,
                        adjustedEnd: (TOTAL_HOURS_PER_DAY * MINUTES_PER_HOUR) + totalMinutesOffset,
                        displayStart: event.start,
                        displayEnd: '24:00',
                        id: `${event.id}_part1_${date}`,
                        name: `${event.name} (Part 1)`,
                        originalDate: date
                    });
                }
                if (eventCrossesIntoCurrentVisibleDate) {
                    allEvents.push({
                        ...event,
                        adjustedStart: totalMinutesOffset,
                        adjustedEnd: endMinutes + totalMinutesOffset,
                        displayStart: '00:00',
                        displayEnd: event.end,
                        id: `${event.id}_part2_${date}`,
                        name: `${event.name} (Part 2)`,
                        originalDate: date
                    });
                }
            }
        });
        totalMinutesOffset += MINUTES_PER_DAY;
    });

    return { events: allEvents };
};

const CustomCalendar = () => {

    const [modalData, setModalData] = useState({})
    const [isModalVisible, setModalVisible] = useState(false);
    const getCurrentDate = useCallback(() => {
        return '2025-06-05';
    }, []);

    const getAllAvailableDates = useCallback(() => {
        const dates = new Set();
        const currentDate = getCurrentDate();
        dates.add(currentDate);
        for (let i = 1; i <= 7; i++) {
            dates.add(addDays(currentDate, i));
        }
        return Array.from(dates)
            .map(dateString => new Date(dateString + 'T00:00:00'))
            .sort((a, b) => a.getTime() - b.getTime())
            .map(dateObj => dateObj.toISOString().split('T')[0]);
    }, [getCurrentDate]);

    const [selectedDate, setSelectedDate] = useState(getCurrentDate());
    const [visibleDates, setVisibleDates] = useState([]);
    const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);

    const timelineScrollRef = useRef(null);
    const eventsScrollRef = useRef(null);
    const isScrolling = useRef(false);
    const lastScrollX = useRef(0);

    const HOUR_WIDTH = 220;
    const STAGE_WIDTH = 100;
    const DAY_WIDTH = TOTAL_HOURS_PER_DAY * HOUR_WIDTH;

    useEffect(() => {
        const allGeneratedDates = getAllAvailableDates();
        setVisibleDates(allGeneratedDates);

        if (!isInitialScrollDone && allGeneratedDates.length > 0) {
            const initialDateIndex = allGeneratedDates.indexOf(getCurrentDate());
            if (initialDateIndex >= 0) {
                const currentHour = 12;
                const currentMinute = 13;
                const currentMinuteOffset = currentHour * MINUTES_PER_HOUR + currentMinute;

                const scrollPositionWithinDay = (currentMinuteOffset / MINUTES_PER_HOUR) * HOUR_WIDTH;
                const totalScrollPosition = initialDateIndex * DAY_WIDTH + scrollPositionWithinDay;
                const adjustedScrollPosition = Math.max(0, totalScrollPosition - (screenWidth - STAGE_WIDTH) / 2);

                setTimeout(() => {
                    if (timelineScrollRef.current && eventsScrollRef.current) {
                        console.log('--- DEBUG: Initial scroll to X:', adjustedScrollPosition);
                        timelineScrollRef.current.scrollTo({ x: adjustedScrollPosition, y: 0, animated: true });
                        eventsScrollRef.current.scrollTo({ x: adjustedScrollPosition, y: 0, animated: true });
                        lastScrollX.current = adjustedScrollPosition;
                        setIsInitialScrollDone(true);
                    }
                }, 500);
            }
        }
    }, [getAllAvailableDates, getCurrentDate, isInitialScrollDone]);

    const { events: relevantEvents } = useMemo(() => {
        if (visibleDates.length === 0) return { events: [] };
        const result = getMultiDayEvents(visibleDates);
        console.log('--- DEBUG: Processed relevantEvents (count):', result.events.length);
        return result;
    }, [visibleDates]);

    const timelineData = useMemo(() => {
        if (visibleDates.length === 0) return { hours: [], dateMarkers: [] };
        const hours = [];
        const dateMarkers = [];
        let totalMinutesForTimeline = 0;

        visibleDates.forEach((date, index) => {
            dateMarkers.push({
                date,
                position: index * DAY_WIDTH,
                isSelected: date === selectedDate,
                width: DAY_WIDTH
            });
            for (let hour = 0; hour < TOTAL_HOURS_PER_DAY; hour++) {
                hours.push({
                    displayTime: minutesToTime(totalMinutesForTimeline),
                    date,
                    globalPosition: totalMinutesForTimeline / MINUTES_PER_HOUR * HOUR_WIDTH,
                    key: `hour-${date}-${hour}`
                });
                totalMinutesForTimeline += MINUTES_PER_HOUR;
            }
        });

        return { hours, dateMarkers, totalTimelineWidth: totalMinutesForTimeline / MINUTES_PER_HOUR * HOUR_WIDTH };
    }, [visibleDates, selectedDate, DAY_WIDTH, HOUR_WIDTH]);

    const handleScroll = useCallback((event) => {
        if (isScrolling.current) return;
        isScrolling.current = true;

        const offsetX = event.nativeEvent.contentOffset.x;
        if (Math.abs(offsetX - lastScrollX.current) > 5) {
            timelineScrollRef.current?.scrollTo({ x: offsetX, y: 0, animated: false });
            eventsScrollRef.current?.scrollTo({ x: offsetX, y: 0, animated: false });
            lastScrollX.current = offsetX;

            const newCurrentDateIndex = Math.floor((offsetX + (screenWidth - STAGE_WIDTH) / 2) / DAY_WIDTH);
            if (newCurrentDateIndex >= 0 && newCurrentDateIndex < visibleDates.length) {
                const newSelectedDate = visibleDates[newCurrentDateIndex];
                if (newSelectedDate !== selectedDate) {
                    setSelectedDate(newSelectedDate);
                    console.log('--- DEBUG: Scroll - New Selected Date:', newSelectedDate);
                }
            }
        }
        isScrolling.current = false;
    }, [visibleDates, selectedDate, screenWidth, STAGE_WIDTH, DAY_WIDTH]);

    const handleScrollEnd = useCallback(() => {
        isScrolling.current = false;
    }, []);

    const getEventPosition = (event) => {
        const startPosition = (event.adjustedStart / MINUTES_PER_HOUR) * HOUR_WIDTH;
        const duration = ((event.adjustedEnd - event.adjustedStart) / MINUTES_PER_HOUR) * HOUR_WIDTH;
        return {
            left: Math.max(0, startPosition),
            width: Math.max(duration, HOUR_WIDTH / 2)
        };
    };

    const renderEventBlock = (event) => {
        const { left, width } = getEventPosition(event);
        return (
            <TouchableOpacity
                key={event.id}
                onPress={() => {
                    setModalVisible(true)
                    setModalData(event)
                }
                }
                style={[
                    styles.eventBlock,
                    {
                        left,
                        width,

                    }
                ]}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={{ backgroundColor: Color.black, height: scale(35), width: scale(35) }} />
                    <View>

                        <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
                        <Text style={styles.eventTime}>{`${event.displayStart}-${event.displayEnd}`}</Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    };

    const groupEventsByStage = () => {
        const stages = ['STAGE', 'MOBIUS', 'PRIZMA', 'MEADOW', 'RODNYA', 'FLOWER', 'GHOSTY', 'PRIZMA', 'MEADOW', 'RODNYA', 'FLOWER', 'GHOSTY'];
        return stages.map(stageName => ({
            stage: stageName,
            events: relevantEvents.filter(event => event.stage === stageName)
        }));
    };

    const stageGroups = groupEventsByStage();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        const day = date.getDate();
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        return `${day} ${months[date.getMonth()]}`;
    };

    const allAvailableDates = useMemo(() => getAllAvailableDates(), [getAllAvailableDates]);
    const currentIndex = allAvailableDates.indexOf(selectedDate);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < allAvailableDates.length - 1;

    const scrollToDate = useCallback((dateToScroll, animated = true) => {
        if (!dateToScroll || !visibleDates.includes(dateToScroll)) {
            console.log('--- DEBUG: scrollToDate aborted - Invalid date:', dateToScroll);
            return;
        }

        const targetDateIndex = visibleDates.indexOf(dateToScroll);
        const scrollPosition = targetDateIndex * DAY_WIDTH;
        const centerAdjustedScrollPosition = Math.max(0, scrollPosition - (screenWidth - STAGE_WIDTH) / 2);

        if (Math.abs(centerAdjustedScrollPosition - lastScrollX.current) > 5) {
            console.log('--- DEBUG: Scrolling to date:', dateToScroll, 'Position:', centerAdjustedScrollPosition);
            timelineScrollRef.current?.scrollTo({ x: centerAdjustedScrollPosition, y: 0, animated });
            eventsScrollRef.current?.scrollTo({ x: centerAdjustedScrollPosition, y: 0, animated });
            lastScrollX.current = centerAdjustedScrollPosition;
        } else {
            console.log('--- DEBUG: Skipped scroll to date:', dateToScroll, 'Already centered');
        }
    }, [visibleDates, DAY_WIDTH, screenWidth, STAGE_WIDTH]);

    const goToPreviousDay = useCallback(() => {
        // if (hasPrevious) {
        //     const prevDate = allAvailableDates[currentIndex - 1];
        //     setSelectedDate(prevDate);
        //     scrollToDate(prevDate);
        // }
    }, [hasPrevious, allAvailableDates, currentIndex, scrollToDate]);

    const goToNextDay = useCallback(() => {
        // if (hasNext) {
        //     const nextDate = allAvailableDates[currentIndex + 1];
        //     setSelectedDate(nextDate);
        //     scrollToDate(nextDate);
        // }
    }, [hasNext, allAvailableDates, currentIndex, scrollToDate]);

    return (

        <ScreenWrapper >

            <ScrollView>
                <CustomModal isVisible={isModalVisible} onClose={() => setModalVisible(false)} modalData={modalData} />
                <View style={styles.container}>
                    <View style={{ paddingHorizontal: scale(16) }}>

                        <Header />
                    </View>
                    <View style={styles.header}>
                        <View style={styles.headerControls}>

                            <TouchableOpacity
                                style={[styles.headerButton, !hasPrevious && styles.disabledButton]}
                                onPress={goToPreviousDay}
                                disabled={!hasPrevious}
                            >
                                <Text style={[styles.headerButtonText, !hasPrevious && styles.disabledText]}>‹</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => scrollToDate(selectedDate)}>
                            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                        </TouchableOpacity>
                        <View style={styles.headerControls}>

                            <TouchableOpacity
                                style={[styles.headerButton, !hasNext && styles.disabledButton]}
                                onPress={goToNextDay}
                                disabled={!hasNext}
                            >
                                <Text style={[styles.headerButtonText, !hasNext && styles.disabledText]}>›</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.timelineHeaderContainer}>
                        <View style={[styles.stageHeaderPlaceholder, { width: STAGE_WIDTH }]} />
                        <ScrollView
                            ref={timelineScrollRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            onScrollEndDrag={handleScrollEnd}
                            onMomentumScrollEnd={handleScrollEnd}
                            scrollEventThrottle={16}
                        >
                            <View style={[styles.timelineHeader, { width: timelineData.totalTimelineWidth }]}>

                                {timelineData.hours.map((hour) => (
                                    <View
                                        key={hour.key}
                                        style={[
                                            styles.hourHeader,
                                            {
                                                width: HOUR_WIDTH,
                                                left: hour.globalPosition,
                                                position: 'absolute',
                                                height: '100%',
                                            }
                                        ]}
                                    >
                                        <Text style={styles.hourText}>{hour.displayTime}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.mainContainer}>
                        <View style={styles.stageColumn}>
                            {stageGroups.map((group, index) => (
                                <View key={index} style={styles.stageRow}>
                                    <Text style={styles.stageLabel}>{group.stage}</Text>
                                </View>
                            ))}
                        </View>
                        <ScrollView
                            ref={eventsScrollRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            onScrollEndDrag={handleScrollEnd}
                            onMomentumScrollEnd={handleScrollEnd}
                            scrollEventThrottle={16}
                            style={styles.eventsScrollView}
                        >
                            <View style={[styles.eventsGrid, { width: timelineData.totalTimelineWidth }]}>
                                {stageGroups.map((group, stageIndex) => (
                                    <View key={stageIndex} style={styles.stageEventsRow}>
                                        <View style={[styles.eventRowContainer, { width: timelineData.totalTimelineWidth }]}>
                                            {group.events.map(event => renderEventBlock(event))}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2a2a2a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#3a3a3a',
    },
    headerControls: {
        flexDirection: 'row',
    },
    headerButton: {
        width: 40,
        height: 40,
        backgroundColor: '#4a4a4a',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',

    },
    disabledButton: {
        backgroundColor: '#333',
    },
    headerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledText: {
        color: '#666',
    },
    dateText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    timelineHeaderContainer: {
        flexDirection: 'row',
        backgroundColor: '#2a2a2a',
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    stageHeaderPlaceholder: {
        height: 50,
        backgroundColor: '#2a2a2a',
    },
    timelineHeader: {
        flexDirection: 'row',
        height: 50,
        position: 'relative',
    },
    dateMarker: {
        position: 'absolute',
        top: 0,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        zIndex: 1,
        paddingHorizontal: 8,
    },
    dateMarkerText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    hourHeader: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#444',
        paddingBottom: 5,
    },
    hourText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    stageColumn: {
        width: 100,
        backgroundColor: '#2a2a2a',
    },
    stageRow: {
        height: 80,
        justifyContent: 'center',
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    stageLabel: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        transform: [{ rotate: '-90deg' }],
        textAlign: 'center',
    },
    eventsScrollView: {
        flex: 1,
    },
    eventsGrid: {
        flex: 1,
    },
    stageEventsRow: {
        height: 80,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        position: 'relative',
    },
    eventRowContainer: {
        height: 80,
        position: 'relative',
    },
    eventBlock: {
        position: 'absolute',
        backgroundColor: '#555',
        borderRadius: 8,
        padding: 8,
        top: 10,
        height: 60,
        justifyContent: 'center',
        borderLeftWidth: 3,
        borderLeftColor: '#888',
    },
    eventName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    eventTime: {
        color: '#ccc',
        fontSize: 12,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
        marginBottom: 10,
    },
    availableDatesText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default CustomCalendar;

