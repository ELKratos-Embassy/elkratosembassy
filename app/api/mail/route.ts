export async function POST(req: Request) {
  const { name, email, query, message } = await req.json();

  console.log(name, email, query, message);
}
