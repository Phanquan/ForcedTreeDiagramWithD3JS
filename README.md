# ForcedTreeDiagramWithD3JS
Build a Tree Diagram with D3js Force Layout v3

### D3JS Force Layout là gì ?

Force layout là một đồ thị vector có hướng linh hoạt sử dụng tích phân để giả lập các định luật vật lý.Vd dụ như thuộc tính pseudo-gravity để giữ các node ở trung tâm của vùng hiển thị, hay fixed-distance để cố định hình học của link,ngoài ra ta còn có thể tạo ra các 'tick' event đặc biệt thông qua các tọa độ x và y của nodes.

Dưới đây là một đối tượng force với các phương thức mặc định nếu các phương thức đó ko được khai báo trong lúc tạo force:   

```javascript
const force = d3.layout.force()
	.nodes(nodes)
	.links(links)
	.size([w,h])
	.linkStrength(0.1)
	.charge(-30)
	.gravity(0.1)
	.theta(0.8)
	.alpha(0.1)
	.start()
```

#### d3.layout.force():  

Khởi tạo một đồ thị hoạt họa vector với các setting mặc đinh: size 1x1, linkStreng 1, friction 0.9, distance 20, độ charge -30, độ gravity 0.1 và biến theta 0.8. Nodes và links mặc định là một mảng rỗng và khi layout bắt đầu, một biến giảm tỏa nội tại được gọi là alpha được tạo với thông số 0.1. Các khởi tạo chung để tạo một đồ thị vector là thiết lập các thuộc tính và sau đó gọi (call) start().  

#### force.size([width,height]):  

Nếu 'size' được khai báo, sẽ thiết lập kích thước của đồ thị với 2 tham số dạng số trong mảng đặc trưng cho x và y. Nếu 'size' không được khai báo,force sẽ lấy giá trị mặc định là [1,1]. 'size' còn ảnh hưởng tới 2 khía cạnh của đồ thị vector là điểm trọng tâm gia tốc (gravittational center) và điểm đặt biến thiên ban đầu (initial random position). Điểm trọng tâm gia tốc đơn giản là điểm (x/2,y/2) trên đồ thị hàm số.  

#### force.linkDistance([distance]):  

Nếu distance được khai báo, nó sẽ thiết lập khoảng cách giữa các nút đã được nối (linked nodes) còn nếu chưa được khai báo, nó sẽ trả về giá trị mặc định là 20.Có thể đưa dạng function vào để đặt linkDistance khác nhau giữa các node và link

Links không hẳn là 'lực co giãn lò xo' (spring forces) như thường được biết tới ở các đồ thị vector khác, mà nó giống các hạn chế hình học yếu. Trong mỗi 'tick' của đồ thị, khoảng cách giữa mỗi nút đã được nối sẽ được tính toán và so sánh với khoảng cách tới đích,links sau đó sẽ di chuyển tới nhau hay đẩy ra xa rồi hội tụ tại điểm đã thiết lập.  

#### force.linkStreng([streng]):  

Thể hiện sự chắc chắn của links thông qua tham số trong khoảng [0,1]. Nếu strength không được khai bạo, đồ thị sẽ trả về giá trị mặc định là 1. Strength có thể không đổi làm cho các link là giống nhau về sự chắc chắn hoặc có thể thay đổi thông qua function.  

#### force.friction([friction]):  

Nếu friction không được khai báo, force sẽ trả về giá trị mặc định là 0.9, nên để giá trị này trong khoảng [0,1 nếu ngoài khoảng này ta sẽ không để lường trước được sự chuyển động của các node và link. Ngoài ra, friction không phải là 'ma sát' mà nó giống 'vận tốc giảm dần' hơn.  

#### force.charge([charge]):  

Nếu charge không được khai báo, force sẽ trả về giá trị mặc định là -30. Giá trị của charge có thể không đổi làm các node sẽ giống nhau về charge hoặc thay đổi theo function.

Khi charge có giá trị '-' ,các node sẽ 'đẩy' nhau còn '+' thì sẽ 'hút' nhau.  

#### force.chargeDistance([distance]):  

Nếu chargeDistance được khai báo, force sẽ thiết lập distance theo tham số, còn nếu không sẽ tả về giá trị mặc định là vô hạn.

#### force.theta([theta]):  

Theta sẽ cài đặt thông số thông qua phép xấp xỉ Barnes-Hut, giá trị mặc định là 0.8.

Để tránh lag do đồ thị lớn, force sẽ sử dụng phép xấp xỉ Barnes-Hut, mất O(n log n) cho mỗi lần tick. Đối với mỗi tick, một quadtree được tạo ra để lưu các vị trí nút hiện tại; Sau đó cho mỗi nút, lực tính tổng của tất cả các nút khác trên nút cho trước được tính. Đối với các nhóm các nút xa hơn, lực thu được xấp xỉ bằng cách xử lý cụm khoảng cách các nút như một nút đơn,hoặc nút lớn. Theta xác định tính chính xác của tính toán: nếu tỷ lệ diện tích của góc phần tư trong quadtree đến khoảng cách giữa một nút đến trung tâm của khối tọa độ thấp hơn theta, tất cả các nút trong góc tọa độ nhất định được coi là một nút đơn, nút lớn, hơn là tính riêng lẻ từng nút.  

#### force.gravity([gravity]):  

Giá trị mặc định của gravity là 0.1

Không nên nhầm lẫn 'gravity' là trọng tâm gia tốc hay trọng lực của 'charge' đã đề cập trên,'gravity' giống như một hạn chế hình học yếu mô phỏng một liên kết kiểu lò xo nối từ node tới trọng tâm của đồ thị. Thế nên nếu node ở gần trọng tâm của đồ thị, gravity sẽ gần như bằng 0, còn ở xa sẽ tăng dần.  

#### force.nodes([nodes]):  

Tham số nodes đưa vào thường dạng mảng các đối tượng node có thuộc tính như sau:  
	* index: vị trí của node trong mảng.
	* x: tọa độ x của node.
	* y: tọa độ y của node.
	* px: tọa độ x vị trí của node ở trước.
	* py: tọa độ y vị trí của node ở trước.
	* fixed: định nghĩa xem node có bị cố định hay không, dạng boolean.
	* weight: weight của node.  

#### force.links([links]):  

Tham số links đưa vào có dạng mảng các link giữa các node, có thuộc tính như sau:  
	* source: node nguồn.
	* target: node đích.  

#### force.start():