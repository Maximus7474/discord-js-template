export default (roles_member: string[], roles_required: string[]): boolean => {
    return roles_required.filter(element => roles_member.includes(element)).length >= 1;
};
