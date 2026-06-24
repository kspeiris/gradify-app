import {
    useAuth
}
from "../context/AuthContext";

export default function ProtectedRoute(
{
    children
}: any
) {

    const {
        user,
        loading
    } = useAuth();

    if (loading)
        return <div>Loading...</div>;

    if (!user)
        return null;

    return children;
}
