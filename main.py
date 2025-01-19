import asyncio
from websockets.asyncio.server import serve

import lang

WAIT_TIME = 1
    
async def handler(websocket):
    while True:
        state = lang.getState()
        await websocket.send(state)
        print(f"Sent: {state}")
        await asyncio.sleep(WAIT_TIME)

async def main():
    async with serve(handler, "localhost", 6969):
        await asyncio.get_running_loop().create_future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())
