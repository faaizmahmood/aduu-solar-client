import AppRoutes from '../routes/routes'

const UnProtectedLayout = () => {
    return (
        <>
            <main>
                <AppRoutes />
            </main>
        </>
    )
}

export default UnProtectedLayout