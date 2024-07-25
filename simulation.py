import numpy as np
import random
import math
from matplotlib import pyplot as plt
from matplotlib import colors
from matplotlib.animation import FuncAnimation

N = 5
J = -1
T = 1
H = 10

lattice = np.random.rand(N, N)

def initialize():
    for i in range(N):
        for j in range(N):
            if (lattice[i][j] < 0.5):
                lattice[i][j] = -1
            else:
                lattice[i][j] = 1

def calc_eps(r, c, flag):
    epsilon = 0
    epsilon = lattice[(r + 1) % N][c] + lattice[(r - 1) % N][c] + lattice[r][(c + 1) % N] + lattice[r][(c - 1) % N]
    epsilon *= 4 * J * lattice[r][c]
    if (flag):
        epsilon += 2 * H * lattice[r][c]
    
    return epsilon

def flip():
    r = random.randint(0, N - 1)
    c = random.randint(0, N - 1)

    epsilon = calc_eps(r, c, True)

    if (epsilon < 0):
        lattice[r][c] *= -1
    elif (random.random() < math.e ** (-epsilon / T)):
        lattice[r][c] *= -1

def main():
    initialize()
    flip()

    cmap = colors.ListedColormap(['red', 'blue'])
    
    def update(frame):
        global lattice
        flip()
        im.set_array(lattice)
        return [im]
    
    fig, ax = plt.subplots()
    im = ax.imshow(lattice, cmap = cmap, vmin = -1, vmax = 1)
    ani = FuncAnimation(fig, update, frames = 100, interval = 1, blit = True)
    plt.show()

if __name__ == '__main__':
    main()