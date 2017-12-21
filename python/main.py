import sys
import keras as ks
import numpy as np
import os

filepath = "./data/Emiel/nexperia.csv"

N = 5000
csv = np.genfromtxt(filepath, delimiter=",")[0:N]
N = csv.shape[0]
print("Entries: ", N)

ATTACKER_X = 0
ATTACKER_Y = 1
ATTACKER_R = 2
DEFENDER_X = 3
DEFENDER_Y = 4

# transform R
print(csv)

csvR = csv[:, ATTACKER_R]
for i, x in enumerate(csvR):
    csvR[i] = (x / np.pi - 1)

print(csv)
print("====")


csvInput = csv[:,[ATTACKER_X, ATTACKER_Y, ATTACKER_R]]
csvOutput= csv[:,[DEFENDER_X, DEFENDER_Y]]

# sys.exit()

# ACTUAL TRAINING with tanh
model = ks.models.Sequential()
model.add(ks.layers.Dense(10, activation=ks.activations.tanh, input_shape=(3,)))
model.add(ks.layers.Dense(10, activation=ks.activations.tanh))
model.add(ks.layers.Dense(10, activation=ks.activations.tanh))
model.add(ks.layers.Dense(2, activation=ks.activations.linear))
model.compile(optimizer=ks.optimizers.Adam(0.01), loss=ks.losses.mean_squared_error)

model.fit(csvInput, csvOutput, batch_size=csv.size, epochs=2000, verbose=1)
# print(model.predict(csvInput))

print(csvInput[0:1])
print(np.array([[0.1, 0.1, 0.1]]))
print(model.predict(csvInput[0:1]))
print(model.predict(np.array([[0.1, 0.1, 0.1]])))


# sys.exit()


import pygame
os.environ['SDL_VIDEO_CENTERED'] = '1'
pygame.init()
pygame.display.set_caption(filepath)

SCALING = 3

FIELD_WIDTH = 250 * SCALING
FIELD_HEIGHT = 170 * SCALING
FIELD_OFFSET = 70 * SCALING

WIDTH = FIELD_WIDTH + FIELD_OFFSET * 2
HEIGHT = FIELD_HEIGHT + FIELD_OFFSET * 2

screen = pygame.display.set_mode((WIDTH, HEIGHT))
done = False

RED = (200, 0, 0)
GREEN = (0, 154, 25)
BLUE = (0, 64, 255)
ORANGE = (255, 128, 0)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
DARK = (30, 30, 30)

clock = pygame.time.Clock()

ax = 0
ay = 0
ar = 0

frame = 0

# translateX
def tX(x):
    return int(FIELD_WIDTH / 2 + x*FIELD_WIDTH / 2) + FIELD_OFFSET

# translateY
def tY(y):
    return int(FIELD_HEIGHT/ 2 + y*FIELD_HEIGHT/ 2) + FIELD_OFFSET

def drawfield(screen):
    pygame.draw.rect(screen, GREEN, (FIELD_OFFSET, FIELD_OFFSET, FIELD_WIDTH, FIELD_HEIGHT))
    pygame.draw.rect(screen, WHITE, (
        FIELD_OFFSET, FIELD_OFFSET + FIELD_HEIGHT/2 - 50*SCALING,
        -15*SCALING, 100*SCALING)
    )
    pygame.draw.line(screen, WHITE, (FIELD_OFFSET, FIELD_OFFSET), (FIELD_OFFSET+FIELD_WIDTH, FIELD_OFFSET))
    pygame.draw.line(screen, WHITE, (FIELD_OFFSET + FIELD_WIDTH, FIELD_OFFSET), (FIELD_OFFSET + FIELD_WIDTH, FIELD_OFFSET + FIELD_HEIGHT))
    pygame.draw.line(screen, WHITE, (FIELD_OFFSET + FIELD_WIDTH, FIELD_OFFSET + FIELD_HEIGHT), (FIELD_OFFSET, FIELD_OFFSET + FIELD_HEIGHT))
    pygame.draw.line(screen, WHITE, (FIELD_OFFSET, FIELD_OFFSET + FIELD_HEIGHT), (FIELD_OFFSET, FIELD_OFFSET))

while not done:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True

    screen.fill((0, 184, 27))
    drawfield(screen)

    frame += 1

    fx = np.cos(frame / 31)*0.8+0.1
    fy = np.sin(frame / 23)*0.8+0.1
    ax = tX(fx)
    ay = tY(fy)
    ar = np.sin(frame/81) * np.pi/2 + np.pi

    input = np.array([[fx, fy, ar/np.pi-1]])
    output = model.predict(input)

    dx = output[0][0]
    dy = output[0][1]

    lx = np.cos(ar) * 100
    ly = -np.sin(ar) * 100

    dx = tX(dx)
    dy = tY(dy)

    lx = tX(lx)
    ly = tY(ly)

    pygame.draw.circle(screen, DARK, (dx, dy), 8*SCALING)

    pygame.draw.circle(screen, ORANGE, (ax, ay), 8*SCALING)

    pygame.draw.line(screen, RED, (ax, ay), (lx, ly), 2)


    pygame.display.flip()
    clock.tick(60)

print("done")







sys.exit()
