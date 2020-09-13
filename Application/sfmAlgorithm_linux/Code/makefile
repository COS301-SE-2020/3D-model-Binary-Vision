main: Source.o SfmPipeline.o Helper.o
	g++ -o ../Executable/main *.o
	g++ -o main *.o

Source.o: Source.cpp
	g++ -c Source.cpp

Helper.o: Helper.cpp Helper.h
	g++ -c Helper.cpp

SfmPipeline.o: SfmPipeline.cpp SfmPipeline.h
	g++ -c SfmPipeline.cpp

run:
	./main

clean:
	rm *.o main
