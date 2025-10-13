import { Resend} from "resend"

export const resend = async() => {
    const resend = new Resend(process.env.RESEND_API_KEY!)

    return resend
}