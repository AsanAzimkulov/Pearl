export function getOverlappingSection(str1, str2, minOverlapLen = 4) {
  var work1 = str1;
  var work2 = str2;
  var w1Len = work1.length;
  var w2Len = work2.length;
  var resultStr = "";
  var foundResult = false;
  var workIndex;

  if (minOverlapLen < 1) {
    minOverlapLen = 1;
  } else if (minOverlapLen > (w1Len > w2Len ? w2Len : w1Len)) {
    minOverlapLen = w1Len > w2Len ? w2Len : w1Len;
  }

  //debugger;

  //we have four loops to go through.  We trim each string down from each end and see if it matches either end of the other string.
  for (var i1f = 0; i1f < w1Len; i1f++) {
    workIndex = work2.indexOf(work1);
    if (
      workIndex == 0 ||
      (workIndex != -1 && workIndex == w2Len - work1.length)
    ) {
      //we found a match!
      foundResult = true;
      resultStr = work1;
      break;
    }

    work1 = work1.substr(1);
    if (work1.length < minOverlapLen) {
      break;
    }
  }

  if (!foundResult) {
    //debugger;

    //reset the work vars...
    work1 = str1;

    for (var i1b = 0; i1b < w1Len; i1b++) {
      workIndex = work2.indexOf(work1);
      if (
        workIndex == 0 ||
        (workIndex != -1 && workIndex == w2Len - work1.length)
      ) {
        //we found a match!
        foundResult = true;
        resultStr = work1;
        break;
      }

      work1 = work1.substr(0, work1.length - 1);
      if (work1.length < minOverlapLen) {
        break;
      }
    }
  }

  if (!foundResult) {
    //debugger;

    //reset the work vars...
    work1 = str1;

    for (var i2f = 0; i2f < w2Len; i2f++) {
      workIndex = work1.indexOf(work2);
      if (
        workIndex == 0 ||
        (workIndex != -1 && workIndex == w1Len - work2.length)
      ) {
        //we found a match!
        foundResult = true;
        resultStr = work2;
        break;
      }

      work2 = work2.substr(1);
      if (work2.length < minOverlapLen) {
        break;
      }
    }
  }

  if (!foundResult) {
    //debugger;

    //reset the work vars...
    work2 = str2;

    for (var i2b = 0; i2b < w2Len; i2b++) {
      workIndex = work1.indexOf(work2);
      if (
        workIndex == 0 ||
        (workIndex != -1 && workIndex == w1Len - work2.length)
      ) {
        //we found a match!
        foundResult = true;
        resultStr = work2;
        break;
      }

      work2 = work2.substr(0, work2.length - 1);
      if (work2.length < minOverlapLen) {
        break;
      }
    }
  }

  return resultStr;
}
