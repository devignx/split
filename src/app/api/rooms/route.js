import { neon } from "@neondatabase/serverless";

async function getData() {
    const sql = neon(process.env.DATABASE_URL);
    const response = await sql`SELECT version()`;
    return response[0].version;
}

// export default async function Page() {
//     const data = await getData();
//     return <>{data}</>;
// }

export async function GET() {
    const data = await getData();
    return Response.json(data);
}
