const prisma = require("../config/prisma");

/**
 * Create a new subject — scoped to the authenticated user
 */
exports.createSubject = async (data, userId) => {
    return await prisma.subject.create({
        data: {
            code:         data.code,
            name:         data.name,
            credits:      Number(data.credits),
            lecturer:     data.lecturer     ?? null,
            description:  data.description  ?? null,
            currentGrade: data.currentGrade ?? null,
            progress:     data.progress     ?? 0,
            status:       data.status,
            semesterId:   Number(data.semesterId),
            userId:       userId,
        },
        include: { semester: true }
    });
};

/**
 * Get all subjects for the user, optionally filtered by semesterId
 */
exports.getSubjects = async (userId, semesterId) => {
    const where = { userId };
    if (semesterId) where.semesterId = Number(semesterId);

    return await prisma.subject.findMany({
        where,
        include:  { semester: true },
        orderBy:  { createdAt: "desc" }
    });
};

/**
 * Get a single subject — only if it belongs to the user
 */
exports.getSubjectById = async (id, userId) => {
    return await prisma.subject.findFirst({
        where:   { id: Number(id), userId },
        include: { semester: true }
    });
};

/**
 * Update subject — verifies ownership first
 */
exports.updateSubject = async (id, data, userId) => {
    const existing = await prisma.subject.findFirst({
        where: { id: Number(id), userId }
    });
    if (!existing) return null;

    // Build only the fields that were provided
    const updateData = {};
    if (data.code         !== undefined) updateData.code         = data.code;
    if (data.name         !== undefined) updateData.name         = data.name;
    if (data.credits      !== undefined) updateData.credits      = Number(data.credits);
    if (data.lecturer     !== undefined) updateData.lecturer     = data.lecturer;
    if (data.description  !== undefined) updateData.description  = data.description;
    if (data.currentGrade !== undefined) updateData.currentGrade = data.currentGrade;
    if (data.progress     !== undefined) updateData.progress     = Number(data.progress);
    if (data.status       !== undefined) updateData.status       = data.status;
    if (data.semesterId   !== undefined) updateData.semesterId   = Number(data.semesterId);

    return await prisma.subject.update({
        where:   { id: Number(id) },
        data:    updateData,
        include: { semester: true }
    });
};

/**
 * Delete subject — verifies ownership first
 */
exports.deleteSubject = async (id, userId) => {
    const existing = await prisma.subject.findFirst({
        where: { id: Number(id), userId }
    });
    if (!existing) return null;

    return await prisma.subject.delete({
        where: { id: Number(id) }
    });
};
