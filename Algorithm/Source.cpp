#include "cameraCalibration.h"
#include <cstdio>


int main()
{
	CameraCalibration calib;
	calib.freshCalibration();

	cout << "End of Execution. " << endl;
	waitKey(0);

	getchar();
	return 0;
}