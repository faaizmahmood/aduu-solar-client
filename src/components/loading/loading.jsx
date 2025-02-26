import styles from './loading.module.scss'

const loadin = () => {
    return (
        <>
            <section className={`${styles.loading}`}>
                Loading...
            </section>
        </>
    )
}

export default loadin