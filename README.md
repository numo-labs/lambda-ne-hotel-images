# lambda ne hotel images

A lambda service that returns images to match the viewport width of the client device

## Why?

We don't want to return high-resolution images to a mobile device
because it wastes bandwidth and space (*cache*) on the device.

Equally, we don't want to return low-res images on Desktop where tiny
images are look bad and aren't very inspiring.

## What?

Given the viewport width of a client (*in pixels*) and the list of
hotels (*hotelids*) return the list of images matching that resolution.

**380 x 215 px** = ***21KB***  
![maldives-small](https://cloud.githubusercontent.com/assets/194400/14723429/604477c4-0811-11e6-9cbc-fd6da4b08341.jpg)

**696 x	307 px** = ***47KB***  
![maldives-large](https://cloud.githubusercontent.com/assets/194400/14723460/89fea27e-0811-11e6-8ba4-d474a7911091.jpg)

**1280 x 853 px** = ***198KB***  
![maldives-large](https://cloud.githubusercontent.com/assets/194400/14721333/2bd4a37a-0806-11e6-9af8-2969337a2356.jpg)

![maldives-image-size-comparison](https://cloud.githubusercontent.com/assets/194400/14723513/bd1c20e6-0811-11e6-8404-393c320024aa.png)

## How?

Sadly, there is no **REST API** we can call for the Images,
instead we got an Excel file (*from Jesper*):

![hotel-images-excel-table](https://cloud.githubusercontent.com/assets/194400/14721720/4b0dd570-0808-11e6-80ab-eacff0dd567b.png)

So the first step was processing the data into a *useful* format.

### 1. Save the `.xlsx` file as `.csv`:

![save-as-csv](https://cloud.githubusercontent.com/assets/194400/14721790/a4e163dc-0808-11e6-9e0b-1849d8b2cf04.png)

Sample data:

```sh
HotelName,WVitemID,ImageURL,ScreenSizeID,SortOrder,ScreenSizeName,Width,Height,ImageText
ABC Hotel,1234,http://img.cdn.net/PVKARTO1006_1_13.jpg,13,1,Hotel part large,696,307,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1006_4_14.jpg,14,1,Hotel part medium,380,215,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1006_3_15.jpg,15,1,Hotel part small,232,131,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1006_6_16.jpg,16,1,Hotel part thumbnail,210,118,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1006_8_17.jpg,17,1,Hotel part prio,210,196,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1006_7_20.jpg,20,1,Hotel part thumbnail small,136,77,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1022_2_29.jpg,29,6,Hotel part fullscreen standing ,631,960,2-v�relses lejlighed med balkon
ABC Hotel,1234,http://img.cdn.net/PVKARTO1018_2_29.jpg,29,10,Hotel part fullscreen standing ,631,960,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1006_2_30.jpg,30,1,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1030_2_30.jpg,30,2,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1010_2_30.jpg,30,3,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1029_2_30.jpg,30,3,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1026_2_30.jpg,30,4,Hotel part fullscreen lying,1280,853,2-v�relses lejlighed med balkon
ABC Hotel,1234,http://img.cdn.net/PVKARTO1027_2_30.jpg,30,4,Hotel part fullscreen lying,1280,853,2-v�relses lejlighed med balkon
ABC Hotel,1234,http://img.cdn.net/PVKARTO1028_2_30.jpg,30,4,Hotel part fullscreen lying,1280,853,1-v�relses lejlighed med f�lles terrasse
ABC Hotel,1234,http://img.cdn.net/PVKARTO1023_2_30.jpg,30,5,Hotel part fullscreen lying,1280,853,2-v�relses lejlighed med balkon
ABC Hotel,1234,http://img.cdn.net/PVKARTO1025_2_30.jpg,30,5,Hotel part fullscreen lying,1280,853,2-v�relses lejlighed med balkon
ABC Hotel,1234,http://img.cdn.net/PVKARTO1024_2_30.jpg,30,5,Hotel part fullscreen lying,1280,853,2-v�relses lejlighed med balkon
ABC Hotel,1234,http://img.cdn.net/PVKARTO1013_2_30.jpg,30,6,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1011_2_30.jpg,30,7,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1021_2_30.jpg,30,7,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1020_2_30.jpg,30,8,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1007_2_30.jpg,30,9,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1019_2_30.jpg,30,9,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1012_2_30.jpg,30,13,Hotel part fullscreen lying,1280,853,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1006_5_32.jpg,32,1,Hotel part thumbnail big lying ,170,113,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1010_5_32.jpg,32,3,Hotel part thumbnail big lying ,170,113,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1007_5_32.jpg,32,9,Hotel part thumbnail big lying ,170,113,
ABC Hotel,1234,http://img.cdn.net/PVKARTO1006_10_51.jpg,51,10,Hotel part top wide,975,350,
```

Run the `lib/parse_csv.js` script

Sample output:

```js
'1234': {
  '380': [ 'http://img.cdn.net/TFSPLAF1020_4_14.jpg' ],
  '1280':
   [ 'http://img.cdn.net/TFSPLAF1020_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1003_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1022_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1008_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1004_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1016_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1017_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1019_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1006_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1028_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1027_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1012_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1026_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1025_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1024_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1010_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1005_2_30.jpg',
     'http://img.cdn.net/TFSPLAF1009_2_30.jpg' ]
}
```

This allows us to do a simple lookup: `img_map[hotelid]['380']`
