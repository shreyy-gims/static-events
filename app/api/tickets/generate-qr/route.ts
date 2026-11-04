import { NextResponse } from 'next/server'
export async function POST(){return NextResponse.json({error:'Passes are issued through the admin guest desk after manual payment confirmation.'},{status:410})}
