let i=0
const rec=(obj,data)=>{
i++

obj.save().than(()=>{rec()})
}