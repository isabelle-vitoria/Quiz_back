import bycrypt from "bcrypt"

export async function CriarHash(senha, salts) {
    const hash = await bycrypt.hash(senha, salts);
    console.log(hash);
    return hash
}

/* export async function CompararHash(senha, hash) {
    const teste = await bycrypt.compare(senha, hash);
    if(teste){
        return true
    }
    else{
        return false
    }
} */