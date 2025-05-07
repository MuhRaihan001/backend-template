const roleHierarchy: Record<string, number> = {
    "visitor": 1,
    "user": 2,
    "admin": 3
};

export async function checkRolePermission(role: string, requiredRole: string) : Promise<boolean>{
    if (!role || !roleHierarchy[role.toLowerCase()]) {
        return false;
    }
    return roleHierarchy[role.toLowerCase()] >= roleHierarchy[requiredRole.toLowerCase()];
}