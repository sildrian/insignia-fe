import {AuthProvider} from './auth/authStore'

const RootProvider = ({children}) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}

export default RootProvider;