<?
//print_r($_FILES);

/*
 * Redirect the user to the index page if they "accidentally" stumble upon here.
 */
if ($_SERVER['REQUEST_METHOD'] != 'POST'){
    header('location: index.html');
}


$error_code = $_FILES['file']['error'];
$file_type = $_FILES['file']['type'];

/*
 * Create an array of acceptable file type;
 */
$acceptable_file_type = ['image/jpeg', 'image/png', 'image/gif'];

/*
 * Check the temporary file uploaded before moving it to the image directory;
 */
if (!$error_code == 0)
{
    /*
     * Check if file uploaded the temporary folder successfully.
     * Error code 0 means the file is uploaded to the temporary folder successfully.
     * If the uploaded file is not moved to a permanent folder,
     * the temporary file will be deleted soon after PHP finishes running the script.
     */

    switch ($error_code)
    {
        case 1:
            die('The uploaded file exceeds the upload_max_filesize directive in php.ini');
            break;

        case 2:
            die('The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form');
            break;

        case 3:
            die('The uploaded file was only partially uploaded');
            break;

        case 4:
            die('No file was uploaded');
            break;

        case 6:
            die('Missing a temporary folder');
            break;

        case 7:
            die('Failed to write file to disk');
            break;

        case 8:
            die('A PHP extension stopped the file upload');
            break;

        default:
            die('Unknown upload error');
            break;
    }
}

/*
 * Check if the uploaded file is actually an image file
 */
elseif (!in_array($file_type, $acceptable_file_type))
{
    die('Please only upload jpeg, png, or gif images');
}


/*
 *  Check if the file size is over 100KB
 */
elseif ($_FILES['file']['size'] > 100000){
    die('File size is too big');
}

else
{
    /*
     * Check if the uploaded image has the correct dimensions;
     * If not, add an error message and redirect back;
     */
    $image_property = getimagesize($_FILES['file']['tmp_name']);
    if ($image_property[0] != $image_property[1])
    {
        die('Please only use square images.');
    }

    elseif ($image_property[0] < 60 || $image_property[1] < 60)
    {
        die('Please use images that are at least 60px by 60px');
    }

    $uploaded_file = 'img/logo/' . basename($_FILES['file']['name']);
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploaded_file))
    {
        $fileUrl =  'http://' . $_SERVER['HTTP_HOST']. dirname($_SERVER['REQUEST_URI']) . '/' . $uploaded_file;
        echo $fileUrl;
    }
}