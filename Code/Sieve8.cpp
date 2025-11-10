#include <array>
#include <cstdio>
#include <cmath>
#include <fstream>
#include <cstdint>
#include <vector>

using namespace std;


  constexpr uint64_t N = 550000000;                               // Set to Test Range - Approximate Max = 550000000
  constexpr size_t MaxIndex = N / 3;
  constexpr size_t ArraySize = MaxIndex + 10; // small buffer
  constexpr size_t BitArraySize = (ArraySize + 63) / 64;

  class BitArray {
    std::vector<uint64_t> bits;
  public:
    BitArray() : bits(BitArraySize, ~uint64_t(0)) {}
    inline void clear(size_t i) { bits[i/64] &= ~(1ULL << (i%64)); }
    inline bool test(size_t i) const { return bits[i/64] & (1ULL << (i%64)); }
  };

  unsigned int StopValue = sqrt(MaxIndex );         // Maximum Number of Records Needed to Used to Finish the Pattern
  constexpr unsigned int ListSize = MaxIndex + 1;		  // List Size to Print

  unsigned int StartingRecord;		                    // Starting Step
  unsigned int LoopIncrement;
  unsigned int CurrentValue;

  unsigned int i;
  unsigned int j;
  bool Sign;

  BitArray List; // all bits set = true

  //std::vector<uint64_t> List((ArraySize + 63) / 64);  // Create the List of the Values of the Set ( 6X ± 1 ) to the Size N

int main (int argc, char* argv[])
{
  // Starting with a boolean array of Size ( N / 3 ) to track Prime Status

  // ----------------------------------------------------------------------------------

  //List.resize(ArraySize);

  //for (i = 1; i < ListSize; ++i) List[i]=true;		// Initialize the List

  for (i = 1; i < StopValue; i+=1)
  {

    if (List.test(i))                                                                 // Is CurrentValue Flagged as Prime
    {
      //Sign = (i & 1) ? -1 : 1;
      CurrentValue = (6 * i + 3 - pow(-1, i)) / 2;;                                    // (6 * i + 3 - pow(-1, i)) / 2;
      LoopIncrement = CurrentValue * 2;                                                 // Set Loop Increment for Inner Loops - (6 * i + 3 - pow(-1, i))
      StartingRecord = CurrentValue * CurrentValue / 3;                                 // Set Starting Record for First Inner Loop

      for (j = StartingRecord; j <= MaxIndex; j += LoopIncrement)                       // First Inner Loop
        List.clear(j);

      StartingRecord = StartingRecord + CurrentValue + 2 * ( (i + 1) / 2 ) * pow(-1, i); // Set Starting Record for Second Inner Loop

      for (j = StartingRecord; j <= MaxIndex; j += LoopIncrement)                       // Second Inner Loop
        List.clear(j);
    }

  }

  // Show List of Primes

  ofstream Myfile;


  Myfile.open ("/home/bill/CLionProjects/Sieve8/list.txt");

  unsigned int Value;
  unsigned int Total = 0;  // Total Number of Primes Found

  Myfile << 2 << "\n" << 3 << "\n";                      // Insert Primes 2 and 3
  Total  = 2;

  for (i = 1; i < MaxIndex; i++)
  {

    if (List.test(i))
    {
      Value = (6 * i + 3 - pow(-1, i)) / 2;
      Myfile << Value << "\n";
      Total  += 1;
    }

  }

  Myfile << "Total Primes: " << Total << "\n";

  Myfile.close();


  // Separate Output File for Just the Total and Time

  Myfile.open ("/home/bill/CLionProjects/Sieve8/results.txt");

  Myfile << "For N = " << N << "\n";

  Myfile << "Total Primes: " << Total << "\n";

  Myfile.close();


}