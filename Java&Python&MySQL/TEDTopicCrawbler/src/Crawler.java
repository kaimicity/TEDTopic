/**
 * 
 */
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.*;
import org.openqa.selenium.safari.SafariDriver;
/**
 * @author sunhantao
 *
 */
public class Crawler {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		WebDriver driver = new ChromeDriver();
        driver.get("https://www.ted.com/topics");
        
        List<WebElement> topics = driver.findElements(By.className("sa"));
        for( WebElement we:topics) {
        	System.out.println(we.getText());
        }
        driver.close();

	}

}
