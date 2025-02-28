import styles from './loading.module.scss'

const Loading = () => {
    return (
        <>
            <section className={`${styles.loading}`}>
                {/* <h5>Loading...</h5> */}
                <div className={`${styles.lds_spinner} mt-3`}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </section>
        </>
    )
}

export default Loading