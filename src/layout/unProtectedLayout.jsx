import AppRoutes from '../routes/routes'

const UnProtectedLayout = () => {
    return (
        <>
            <main style={{ height: '100vh' }}>
                <AppRoutes />
            </main>
        </>
    )
}

export default UnProtectedLayout