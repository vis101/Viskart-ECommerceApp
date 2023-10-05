import bcrypt from 'bcrypt'

export const hashPassword = async(password)=>{
    try {
        const saltRounds = 2;
        const hashedPass = await bcrypt.hash(password, saltRounds);
        return hashedPass

    } catch (error) {
        console.log(error)
    }
};

export const comparePass = async(password, hashedPass)=>{
    return bcrypt.compare(password, hashedPass);
};