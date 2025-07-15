'use client'
import React, {useState, useEffect} from 'react'
import styles from '@/app/styles/DatabaseStatusIndicator.module.css'

const DatabaseStatusIndicator = () => {
    const [isOnline, setIsOnline] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [lastChecked, setLastChecked] = useState<string>('')
    useEffect(() => {
        let retryCount = 0
        const maxRetries = 5

        const checkDatabaseStatus = async () => {
            setLastChecked(new Date().toLocaleTimeString())
            try {
                const response = await fetch('/api/db-status')
                const data = await response.json()
                setIsOnline(data.status === 'ok')
                retryCount = 0 // Сброс счетчика при успешном подключении
            } catch (error) {
                setIsOnline(false)
                if (retryCount < maxRetries) {
                    retryCount++
                    setTimeout(checkDatabaseStatus, 5000 * retryCount) // Экспоненциальная задержка
                }
            } finally {
                setIsLoading(false)
            }
        }

        checkDatabaseStatus()
        const interval = setInterval(checkDatabaseStatus, 30000)

        return () => clearInterval(interval)
    }, [])

    if (isLoading) return null

    return (
        <div className={styles.statusContainer}>
            <div className={`${styles.statusIndicator} ${isOnline ? styles.online : styles.offline}`}>
                <div className={styles.statusDot}/>
                <span className={styles.statusText}>
                    {isOnline ? 'Подключено к серверу бызы данных PostgreSQL' : 'Нет подключения к серверу бызы данных PostgreSQL'}
                </span>
                <span className={styles.lastChecked}>&nbsp;
                    последняя проверка: {lastChecked}
                </span>
            </div>
        </div>
    )
}

export default DatabaseStatusIndicator
