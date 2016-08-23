## Purpose
This game explores the World Health Organization's (WHO's) morbidity database by having players write bits of Structured Query Language (SQL). The game is made of a canvas and a browser UI. The canvas facilitates the side scrolling adventure, while the queries are used to change the landscape that the player explores. Along the way, the player will learn historical facts about how people have lived and died on across the globe, since 1950, the earliest year of when the WHO has assembled data. 

This is an experiment. If I get enough work done on this, I will host it on the cloud.

## You Can't Run it Yet
Currently this code isn't runnable unless you actually have all the data loaded onto a local database. It will crash if you try to do the standard ```npm install``` and ```npm start```; thus the need to host this project on a running server.

It is possible to run the project locally, but you'd have to download all the data from the WHO, change the format of some of the downloaded Excel files to .tsv/.csv files, then write your own SQL scripts for whichever relational database you use so you can load the .tsv/.csv files. Again, ideally I will get the database hosted online and connected to the game.
