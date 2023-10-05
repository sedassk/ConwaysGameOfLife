using System.Web.Http;

namespace GameOfLife.Controllers
{
    [RoutePrefix("api/GameOfLife")]
    public class GameOfLifeController : ApiController
    {
        private int[,] grid = new int[50,100];
        private int[,] nextGrid = new int[50,100];


        [Route("StartGame")]
        [HttpGet]
        public IHttpActionResult StartGame(int row, int col, int rows, int columns)
        {
            var neighborsCount = CountTheNeighbors(row, col, rows, columns);
            return Ok(neighborsCount);
        }

        private int CountTheNeighbors(int row, int col, int rows, int columns)
        {
            var count = 0;

            if (row < 49 || col < 99)
            {
                if (row - 1 >= 0)
                {
                    if (grid[row - 1, col] == 1) count++;
                }
                if (row - 1 >= 0 && col - 1 >= 0)
                {
                    if (grid[row - 1, col - 1] == 1) count++;
                }
                if (row - 1 >= 0 && col + 1 < columns)
                {
                    if (grid[row - 1, col + 1] == 1) count++;
                }
                if (col - 1 >= 0)
                {
                    if (grid[row, col - 1] == 1) count++;
                }
                if (col + 1 < columns)
                {
                    if (grid[row, col + 1] == 1) count++;
                }
                if (row + 1 < rows)
                {
                    if (grid[row + 1, col] == 1) count++;
                }
                if (row + 1 < rows && col - 1 >= 0)
                {
                    if (grid[row + 1, col - 1] == 1) count++;
                }
                if (row + 1 < rows && col + 1 < columns)
                {
                    if (grid[row + 1, col + 1] == 1) count++;
                }
            }

            return count;
        }
    }
}
