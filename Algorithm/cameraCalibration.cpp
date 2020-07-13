#include "cameraCalibration.h"

CameraCalibration::CameraCalibration() {
	
}


void CameraCalibration::freshCalibration() {
	Mat color_image;
	Mat image;
	bool found = false;
	String file_path;
	int successful_images = 0;

	//Set the camera's aspect ratio to x:y
	intrinsic_matrix.ptr<float>(0)[0] = aspect_x;
	intrinsic_matrix.ptr<float>(1)[1] = aspect_y;

	//Create the chessboard points.

	int squares_num = getSquares();
	vector<Point3f> chess_points;
	for (int i = 0; i < squares_num; i++)
		chess_points.push_back(Point3f(i / horizontal_corners, i % horizontal_corners, 0.0f));


	//Holds the size of the chessboard we use for calibration
	Size board_size = Size(horizontal_corners, vertical_corners);

	//Create a list of the jpg file names in the calibration folder
	vector<cv::String> file_names;
	glob("calibration/*.jpg", file_names, false);
	int files_num = file_names.size();
	cout << "found " << files_num << " jpg files." << endl;
	if (files_num == 0) {
		cout << "CALIBRATION FAIL: No jpg files found in the calibration folder!" << endl;
		return;
	}

	//Create a window to view the chessboard detection process
	namedWindow("calibration", WINDOW_NORMAL);
	resizeWindow("calibration", window_width, window_height);


	for (int i = 0; i < files_num; i++) {

		file_path = file_names.at(i);
		cout << "Iteration " << i+1 << "/" << files_num << ", current file: "<< file_path << endl;

		//Read in the chessboard image from the given path
		color_image = imread(file_path, IMREAD_COLOR);

		//Convert the image to black and white to make it easier to recognise a chessboard
		cvtColor(color_image, image, COLOR_BGR2GRAY);

		//Check if the image read successfully
		if (image.empty()) {
			cout << "ERROR: could not open image at " << file_path << endl;
			return;
		}


		// Try and find the chessboard on the given image
		try {
			cout << "finding chessboard on image..." << endl;
			found = findChessboardCorners(image, board_size, corners);
		}
		catch (cv::Exception & e) {
			cerr << e.what() << endl;
			return;
		}

		if (found)
		{
			cout << "found chessboard!" << endl;
			//Finds all the corners and stores them in our vector
			cornerSubPix(image, corners, Size(11, 11), Size(-1, -1), TermCriteria(TermCriteria::EPS | TermCriteria::MAX_ITER, 30, 0.1));
			drawChessboardCorners(color_image, board_size, corners, found);

			//Store the points
			image_points.push_back(corners);
			object_points.push_back(chess_points);
			
			successful_images++;
		}
		else {
			cout << "chessboard was not found!" << endl;
		}

		imshow("calibration", color_image);
		waitKey(100);

	}

	//Calibrate camera with given data
	cout << "Calibrating with calculated points..." << endl;
	calibrateCamera(object_points, image_points, image.size(), intrinsic_matrix, distortion_coefficients, rotation_vectors, translation_vectors);

	//Beginning of results of calibration
	Mat after_image;
	namedWindow("after", WINDOW_NORMAL);
	resizeWindow("after", window_width, window_height);
	undistort(color_image, after_image, intrinsic_matrix, distortion_coefficients);
	imshow("after", after_image);
	//End of results of calibration


	cout << "CALIBRATION SUCCESS: " << successful_images << "/" << files_num << " images calibrated successfully!" << endl;
}

void CameraCalibration::setChessboardCorners(int horizontal, int vertical)
{
	horizontal_corners = horizontal;
	vertical_corners = vertical;
}

void CameraCalibration::setCameraAspect(int x, int y)
{
	aspect_x = x;
	aspect_y = y;
}

int CameraCalibration::getSquares()
{
	return horizontal_corners * vertical_corners;
}
