import { NextResponse } from 'next/server'

export async function GET() {
  const data = {
    "items": [
      {
        "title": "Audi_A4_S4",
        "cover": `http://localhost:${process.env.PORT}/images/Audi_A4_S4.png`,
        "play_url": `http://localhost:${process.env.PORT}/media/Audi_A4_S4.m3u8`
      },
      {
        "title": "Bugatti_Chiron",
        "cover": `http://localhost:${process.env.PORT}/images/Bugatti_Chiron.png`,
        "play_url": `http://localhost:${process.env.PORT}/media/Bugatti_Chiron.m3u8`
      },
      {
        "title": "Range_Rover_Sport_L322",
        "cover": `http://localhost:${process.env.PORT}/images/Range_Rover_Sport_L322.png`,
        "play_url": `http://localhost:${process.env.PORT}/media/Range_Rover_Sport_L322.m3u8`
      }
    ]
  }
 
  return NextResponse.json(data)
}