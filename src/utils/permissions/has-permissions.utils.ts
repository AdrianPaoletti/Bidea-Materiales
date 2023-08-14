export type permissionTasks =
    | "rPrecargaRecursos"
    | "wPrecargaRecursos"
    | "rCargaRecursos"
    | "wCargaRecursos"
    | "rIncidencias"
    | "wIncidencias"
    | "rInformes"
    | "wInformes"
    | "admin"

export const hasPermission = (tasks: permissionTasks[], userPermissions: permissionTasks[]) => {
    let hasPermission = true;
    for (const task of tasks) {
        if (!userPermissions.includes(task)) {
            hasPermission = false;
        }
    }
    return hasPermission;
}
